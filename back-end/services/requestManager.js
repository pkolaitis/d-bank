const configManager = require('./configManager');
const requestManager = {
    reply: function(res, result, status = 200, delay){
        setTimeout(() => {
            res.status(status).send({replica: process.pid, ...result});
        }, delay || configManager.rttdelay);
    }
};

module.exports = requestManager;