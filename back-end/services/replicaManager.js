const express = require('express');
const users = require('../data/users');
const logManager = require('./logManager');

const replicaManager = {
    numReqs: 0,
    workers: [],
    data: {
        users: users,
        transactions: {},
        history: []
    },
    initializeNewReplica: function () {  
        const app = express();
        process.numReqs = 0;
        process.data = replicaManager.data;
        process.on('message', function (msg) {
            switch (msg.cmd) {
                case 'transaction':
                    logManager.info(`${process.pid} received transaction data ${msg}`);
                    break;
                case 'transactionConsented':
                    logManager.info(`${process.pid} got consented transaction data ${msg}`);
                    break;
            }

        });
        return app;
    },
    check: function () {
        console.log('check');
    },
};

module.exports = replicaManager;
