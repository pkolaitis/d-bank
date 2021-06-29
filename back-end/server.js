const cluster = require('cluster');
const http = require('http');
const cors = require('cors');
const CONFIG = require('./config/config');
const express = require( 'express' );
const path = require( 'path' );

var root = path.dirname( __dirname );
console.log(CONFIG);
if( cluster.isMaster ) {
  // Create a worker for each CPU
  for( var i = 0; i < CONFIG.REPLICAS; i++ ) {
    cluster.fork();
  }

  cluster.on( 'online', function( worker ) {
    console.log( 'Worker ' + worker.process.pid + ' is online.' );
  });
  cluster.on( 'exit', function( worker, code, signal ) {
    console.log( 'worker ' + worker.process.pid + ' died.' );
  });
}
else {
  const app    = express();
//   var routes = require( './routes' )( app );
    app.get('/', cors(), (req, res) => {
        setTimeout(()=>{
            const result = {msg: 'Worker ' + process.pid + ' responded.' };
            console.log(result);
            res.send(result);
        }, CONFIG.DDELAY);
        
    } );
  app
    .use(cors())
    .listen( CONFIG.PORT);

}