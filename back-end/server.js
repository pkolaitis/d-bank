const cluster = require('cluster');
const http = require('http');
const cors = require('cors');
const CONFIG = require('./config/config');
const express = require( 'express' );
const path = require( 'path' );
const workers = [];
var numReqs = 0;

var root = path.dirname( __dirname );
console.log(CONFIG);
if( cluster.isMaster ) {
  // Create a worker for each CPU
  var broadcast = function() {
    for (var i in workers) {
      var worker = workers[i];
      worker.send({ cmd: 'broadcast', numReqs: numReqs });
    }
  }
  for( var i = 0; i < CONFIG.REPLICAS; i++ ) {
    workers.push(cluster.fork());
    workers[i].on('message', function(msg) {
      if (msg.cmd) {
        switch (msg.cmd) {
          case 'notifyRequest':
            numReqs++;
          break;
          case 'broadcast':
            broadcast();
          break;
        }
      }
    });
  }
  
  setInterval(function() {
    console.log("numReqs =", numReqs);
  }, 1000);

  cluster.on( 'online', function( worker ) {
    console.log( 'Worker ' + worker.process.pid + ' is online.' );
  });
  cluster.on( 'exit', function( worker, code, signal ) {
    console.log( 'worker ' + worker.process.pid + ' died.' );
  });
}
else {
  const app = express();
  cluster.workerData = {
    id: process.pid,
    greeting: 'Worker ' + process.pid + ' responded'
  };

  process.on('message', function(msg) {
    switch(msg.cmd) {
      case 'broadcast':
        if (msg.numReqs) console.log(process.pid + 'Number of requests: ' + msg.numReqs);
      break;
    }
  });

  app.get('/', cors(), (req, res) => {
    // cluster.send('message', message);
    process.send({ cmd: 'notifyRequest' });
    process.send({ cmd: 'broadcast' });
    setTimeout(()=>{
        const result = cluster.workerData;
        console.log(result);
        res.send(result);
    }, CONFIG.DDELAY);  
  });

  app.use(cors()).listen( CONFIG.PORT);

  cluster.addListener('message', function(data){
    console.log('Worker ' + process.pid + ' received data:' + data.message + data.id);
  });
  const message = {message: 'Worker ' + process.pid + ' responded.', id: process.pid };
  cluster.emit('message', message);
  

}