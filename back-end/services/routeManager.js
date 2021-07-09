const cors = require('cors');
const logManager = require('./logManager');
const authManager = require('./authManager');
const requestManager = require('./requestManager');
const transactionManager = require('./transactionManager');
const configManager = require('./configManager');
const routeManager = {
    routes: [
        {
            path: '/', 
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
            guard: authManager.nullToken, 
            method: (req, res) => {
                authManager.login(req, res);
            }
        },
        {
            type: 'get',
            path: '/getUser',
            guard: authManager.verifyToken, 
            method: (req, res) => {
                authManager.getUser(req, res);
            }
        },
        {
            path: '/logout', 
            guard: authManager.nullToken, 
            method: (req, res) => {
                const result = {pid: process.pid, message: `logout accepted`};
                requestManager.reply(res, result);
            }
        },
        {
            type: 'post',
            path: '/transact', 
            guard: authManager.verifyToken,
            method: (req, res) => {
                const transaction = { 
                    source: req.user.isAdmin ? req.headers.from : req.user.username, 
                    target: req.headers.type === 'transfer' ? req.headers.to : '', 
                    amount: parseInt(req.headers.amount), 
                    type: req.headers.type, 
                    arrivedAt: req.headers.arrivedAt || null
                };
                transactionManager.newTransaction(transaction);
                
                const result = {pid: process.pid, code: 'SUCCESS', message: `transaction accepted and will be handled soon`};
                requestManager.reply(res, result);
            }
        },
        {
            type: 'get',
            path: '/getTransactions', 
            guard: authManager.verifyToken,
            method: (req, res) => {
                const transactions = transactionManager.getTransactions(req.user);
                requestManager.reply(res, { user: req.user, transactions, total: transactions?.length});
            }
        },
        {
            type: 'get',
            path: '/getAllData', 
            guard: authManager.verifyToken,
            method: (req, res) => {
                if(req.user && req.user.isAdmin === true){
                    const transations = transactionManager.getTransactions(req.user);
                    requestManager.reply(res, { user: req.user, data: process.data}, 200, 2000);
                }else{
                    requestManager.reply(res, { });
                }
            }
        },
        {
            path: '/getStatistics', 
            guard: authManager.verifyToken, 
            method: (req, res) => {
                const result = transactionManager.getStatistics(req, res);
                requestManager.reply(res, {user: req.user, msg: 'Get statistics', statistics: result});
            }
        },
        {
            path: '/history', 
            guard: authManager.verifyToken, 
            method: (req, res) => {

                const result = {pid: process.pid, message: `list of transactions`};
                requestManager.reply(res, result);
            }
        },
        {
            path: '/kill', 
            guard: authManager.nullToken, 
            method: (req, res) => {
                const result = {pid: process.pid, message: `killing worker`};
                requestManager.reply(res, result);
                setTimeout(function(){
                    throw `${process.pid} was killed by user`;
                }, configManager.rttdelay);
            }
        }
    ],
    registerAll: function(app){
        routeManager.routes.forEach(route => {
            app[route.type || 'get'](route.path, cors(), route.guard, route.method);
        });
    }
};

module.exports = routeManager;