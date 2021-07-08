const cluster = require('cluster');

const path = require('path');
var root = path.dirname(__dirname);

const configManager = require('./services/configManager');
const routeManager = require('./services/routeManager');
const replicaManager = require('./services/replicaManager');
const logManager = require('./services/logManager');

// logManager.info(JSON.stringify(configManager));

if (cluster.isMaster) {
  // Create a worker for each CPU

  for (var i = 0; i < configManager.replicas; i++) {
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
    replicaManager.workers.push(worker);
  }
  var broadcast = function(data) {
    logManager.info(`starting broadcasting ${JSON.stringify(data)}`);
    for (var i in replicaManager.workers) {
      var worker = replicaManager.workers[i];
      worker.send({ cmd: 'broadcast', data: data });
    }
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
  });
} else {
  const app = replicaManager.initializeNewReplica();
  routeManager.registerAll(app);

  process.on('message', function(msg) {
    switch(msg.cmd) {
      case 'broadcast':
        logManager.info(`${process.pid} got message ${JSON.stringify(msg)}`);
        if (msg.numReqs) console.log(process.pid + 'Number of requests: ' + msg.numReqs);
      break;
    }
  });

  app.listen(configManager.port);
}
