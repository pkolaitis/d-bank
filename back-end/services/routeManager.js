const cors = require('cors');
const logManager = require('./logManager');
const authManager = require('./authManager');
const requestManager = require('./requestManager');
const transactionManager = require('./transactionManager');
const routeManager = {
    routes: [
        {
            path: '/', 
            cors: cors(), 
            guard: authManager.nullToken, 
            method: (req, res) => {
                const result = {pid: process.pid, message: `Hello there`};
                logManager.info(JSON.stringify(result));
                requestManager.reply(res, result);
            }
        },
        {
            type: 'post',
            path: '/login',
            cors: cors(),
            guard: authManager.nullToken, 
            method: (req, res) => {
                authManager.login(req, res);
            }
        },
        {
            path: '/logout', 
            cors: cors(), 
            guard: authManager.nullToken, 
            method: (req, res) => {
                const result = {pid: process.pid, message: `logout accepted`};
                requestManager.reply(res, result);
            }
        },
        {
            type: 'post',
            path: '/transact', 
            cors: cors(),
            guard: authManager.verifyToken,
            method: (req, res) => {
                const transaction = { source: req.headers.from, target: req.headers.to, amount: req.headers.amount, type: req.headers.type };
                transactionManager.newTransaction(transaction);
                
                const result = {pid: process.pid, message: `transaction accepted and will be handled soon`};
                requestManager.reply(res, result);
            }
        },
        {
            path: '/history', 
            cors: cors(),
            guard: authManager.verifyToken, 
            method: (req, res) => {

                const result = {pid: process.pid, message: `list of transactions`};
                requestManager.reply(res, result);
            }
        }
    ],
    registerAll: function(app){
        routeManager.routes.forEach(route => {
            app[route.type || 'get'](route.path, route.cors, route.guard, route.method);
        });
    }
};

module.exports = routeManager;