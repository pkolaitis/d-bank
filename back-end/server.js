const cluster = require('cluster');

const path = require('path');
var root = path.dirname(__dirname);

const configManager = require('./services/configManager');
const routeManager = require('./services/routeManager');
const replicaManager = require('./services/replicaManager');
const logManager = require('./services/logManager');
const transactionManager = require('./services/transactionManager');

// logManager.info(JSON.stringify(configManager));

if (cluster.isMaster) {
  // Create a worker for each CPU
  var createReplica = function(){
    const worker = cluster.fork(); 
    worker.on('message', function(msg) {
      logManager.info(`worker got message ${JSON.stringify(msg)}`);
      if (msg.cmd) {
        switch (msg.cmd) {
          case 'broadcast':
            broadcast(msg);
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

  // setInterval(function () {
  //   logManager.info(`numReqs = ${replicaManager.numReqs}`);
  // }, configManager.pdelay);

  cluster.on('online', function (worker) {
    logManager.info(`Worker ${worker.process.pid} is online.`);
    worker.process.workers = replicaManager.workers;
  });
  cluster.on('exit', function (worker, code, signal) {
    logManager.info(`Worker ${worker.process.pid} died.`);
    delete replicaManager.workers[worker.process.pid];
    createReplica();
  });
} else {
  const app = replicaManager.initializeNewReplica();
  routeManager.registerAll(app);

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
        }
        if (msg.numReqs) console.log(process.pid + 'Number of requests: ' + msg.numReqs);
      break;
    }
  });

  setInterval(transactionManager.processTransactions, configManager.processWindow);

  app.listen(configManager.port);
}
