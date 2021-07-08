const configManager = require('./configManager');
const requestManager = {
    reply: function(res, result, status = 200){
        setTimeout(() => {
            res.status(status).send(result);
        }, configManager.rttdelay);
    }
};

module.exports = requestManager;