const jwt = require('jsonwebtoken');
const configManager = require('./configManager');
const logManager = require('./logManager');
const requestManager = require('./requestManager');
const userManager = require('./userManager');
const authManager = { 
  login: function (req, res) {
    // console.log('login');
    const id  = req.headers.id;
    const username = req.headers.username;
    const password = req.headers.password;
    const user = userManager.isValidLoginInfo(username,password);
    if(userManager.isValidLoginInfo(username,password)){
      jwt.sign( {time: new Date(), ...user } , 'secret_key' , (err,token) => {
          if(err){
              requestManager.reply(res, {msg: 'Error'});
          } else {
              requestManager.reply(res, {msg:'success' , token: token, user: {time: new Date(), ...user }});
          }
      });
    } else {
      requestManager.reply(res, {msg:'Unknown user'});
    }
  },
  logout: function () {
    console.log('logout');
  },
  nullToken: function(req, res, next){
    setTimeout(next, configManager.rttdelay); 
  },
  verifyToken: function(req, res, next) {
    const token = req.headers["x-token"];
    logManager.info(`authenticating ${token}`);
    if (!token) {
      requestManager.reply(res, {authorized: false, reason: 'unauthorized token passed'});
    } else if (token === configManager.superpass) {
      setTimeout(next, configManager.rttdelay);
    } else {
      jwt.verify(token, "secret_key", (err, user) => {
          if (err) {
              logManager.error(`Error authenticating with passed token ${token}: ${err}`);
              requestManager.reply(res, {authorized: false, reason: 'unauthorized token passed'});
          } else {
            logManager.info(`User ${JSON.stringify(user)} authenticated`);
            req.user = user;
            logManager.info(`Authenticated token ${token}`);
            next();
          }
      });
    }
  }
};
module.exports = authManager;
