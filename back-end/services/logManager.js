const logManager = {
    logLevel: process.env.logLevel || 4,
    // dbConnection: {},
    info: function (message) {
      if(logManager.logLevel >=4){
        logManager.log('LOG MANAGER INFO: ' + message, 'info');
      }
    },
    error: function (message) {
      if(logManager.logLevel > 0){
        logManager.log('LOG MANAGER ERROR: ' + message, 'error');
      }
    },
    log: function(message, ff){
      if (console[ff]) {
        console[ff](message);
      } else {
        console.log(message);
      }
    },
};

module.exports = logManager;
