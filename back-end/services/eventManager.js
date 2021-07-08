const replicaManager = require("./replicaManager");
const logManager = require("./logManager");
const cluster = require('cluster');
const eventManager = {
  broadcast: function (msg) {
    logManager.info(`broadcastEvent ${process.workers.length}`);
    for (var i in workers) {
      var worker = workers[i];
      // worker.numReqs++;
      logManager.info(`${msg} - ${process.id}`);
      worker.send({ cmd: 'broadcast', numReqs: ++replicaManager.numReqs});
    }
  },
  listen: function (worker) {
    worker.on('message', function (msg) {
      logManager.info(`${msg} received by ${process.pid}`);
      if (msg.cmd) {
        switch (msg.cmd) {
          case 'notifyRequest':
            logManager.error('this is an error message to test what was passing through' + JSON.stringify(msg));
            process.numReqs++;
            break;
          
          case 'broadcast':
            replicaManager.numReqs++;
            eventManager.broadcast(msg, process.workers);
            break;

          case 'transaction':
            eventManager.broadcast(msg, process.workers);
            break;
        }
      }
    });
  },
  postEvent: function () {
    logManager.info('postEvent');
  },
};

module.exports = eventManager;
