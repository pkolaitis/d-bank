const cluster = require('cluster');
const express = require('express');

const path = require('path');
var root = path.dirname(__dirname);
const cors = require('cors');

const configManager = require('./services/configManager');
const routeManager = require('./services/routeManager');
const replicaManager = require('./services/replicaManager');
const logManager = require('./services/logManager');
const transactionManager = require('./services/transactionManager');
const requestManager = require('./services/requestManager');
const authManager = require('./services/authManager');

// logManager.info(JSON.stringify(configManager));

if (cluster.isMaster) {
  // Create a worker for each CPU
  process.data = replicaManager.data;
  var createReplica = function(){
    const worker = cluster.fork(); 
    worker.on('message', function(msg) {
      logManager.info(`worker got message ${JSON.stringify(msg)}`);
      if (msg.cmd) {
        switch (msg.cmd) {
          case 'broadcast':
            broadcast(msg);
            logManager.info(`${process.pid} got message ${JSON.stringify(msg)} ${msg.event}`);
            if(msg.event === "transaction") {
              const transaction = msg.data;
              process.data.transactions = process.data.transactions || {};
              process.data.transactions.size = (process.data.transactions.size || 0) + 1;
              process.data.transactions[transaction.processAt] = process.data.transactions[transaction.processAt] || [];
              process.data.transactions[transaction.processAt].push(transaction);
              process.data.history = process.data.history || [];
              process.data.history.push(transaction);
            }
          break;
          
        }
      }
    });
    if (replicaManager.workers.keys().length > 0) {
      worker.process.data = JSON.parse(JSON.stringify(replicaManager.workers[replicaManager.workers.keys()[0]].process.data));
    } else {
      worker.process.data = JSON.parse(JSON.stringify(replicaManager.data));
    }
    replicaManager.workers[worker.process.pid] = worker;
  };
  var broadcast = function(data) {
    logManager.info(`starting broadcasting ${JSON.stringify(data)}`);
    for (var i in replicaManager.workers) {
      var worker = replicaManager.workers[i];
      worker.send(data);
    }
  }
  for (var i = 0; i < configManager.replicas; i++) {
    createReplica();
  }
  var sendStatistics = function(req, res){
    const result = [];
    result.push({
      isParent: true,
      pid: process.pid,
      users: process.data.users,
      transactions: { 
        failed: process.data.history.filter(x=>x.failed).length,
        successful: process.data.history.filter(x=>x.passed).length,
        all: process.data.history.length
      }
    });
    for(let index in replicaManager.workers){
      const worker = replicaManager.workers[index];
      result.push({
        pid: worker.process.pid,
        users: worker.process.data.users,
        transactions: { 
          failed: worker.process.data.history.filter(x=>x.failed).length,
          successful: worker.process.data.history.filter(x=>x.passed).length,
          all: worker.process.data.history.length
        }
      });
    }
    requestManager.reply(res, result);
  };

  setInterval(transactionManager.processTransactions, configManager.processWindow);
  setInterval(function () {
    // logManager.info(`numReqs = ${replicaManager.numReqs}`);
    // logManager.info(`Running checks for inconstistencies`);
    let shouldBe = null;
    for(const index in replicaManager.workers){
      const users = replicaManager.workers[index].process.data.users;
      const logData = {
        id: `@@${replicaManager.workers[index].process.pid} :`,
        workerData: []
      };
      for(const uindex in users){
        const user = users[uindex];
        logData.workerData.push(`${user.username} - ${user.balance}`);
      }
      const whatIs = logData.workerData.join('\n');
      if(!shouldBe){
        shouldBe = whatIs;
      }
      if(shouldBe != whatIs){
        logManager.error(`${logData.id} are different from what should be`);
        logManager.error(`Checking for consistency errors ${whatIs}`);
        logManager.error(`Checking for consistency errors ${shouldBe}`);
      }
    }
  }, configManager.pdelay);

  cluster.on('online', function (worker) {
    logManager.info(`Worker ${worker.process.pid} is online.`);
    worker.process.workers = replicaManager.workers;
  });
  cluster.on('exit', function (worker, code, signal) {
    logManager.info(`Worker ${worker.process.pid} died.`);
    delete replicaManager.workers[worker.process.pid];
    createReplica();
  });
  const app = express();
  app.use(cors());
  app.get('/getStatistics', cors(), authManager.verifyToken, sendStatistics);
  app.listen(configManager.port+1);
  logManager.info(`${process.pid} listening for statistics`);
} else {
  const app = replicaManager.initializeNewReplica();
  routeManager.registerAll(app);
  process.data.transactions = process.data.transactions || {};
  process.data.history = process.data.history || [];
  process.on('message', function(msg) {
    switch(msg.cmd) {
      case 'broadcast':
        // handle transaction to be executed
        logManager.info(`${process.pid} got message ${JSON.stringify(msg)} ${msg.event}`);
        if(msg.event === "transaction") {
          const transaction = msg.data;
          process.data.transactions = process.data.transactions || {};
          process.data.transactions.size = (process.data.transactions.size || 0) + 1;
          process.data.transactions[transaction.processAt] = process.data.transactions[transaction.processAt] || [];
          process.data.transactions[transaction.processAt].push(transaction);
          process.data.history = process.data.history || [];
          process.data.history.push(transaction);
        }
      break;
    }
  });

  setInterval(transactionManager.processTransactions, configManager.processWindow);
  app.use(cors());
  app.listen(configManager.port);
}
