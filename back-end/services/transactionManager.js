const configManager = require("./configManager");
const logManager = require("./logManager");

const transactionManager = {
  newTransaction: function (transaction) {
    // e-paxos phase 1
    logManager.info(`newTransaction arrived ${process.pid} ${JSON.stringify(transaction)}`);
    transaction.originator = process.pid;
    // adding a couple milliseconds randomly for each transaction to be delayed
    transaction.arrivedAt = transaction.arrivedAt || new Date().getTime();
    transaction.processAt = transaction.arrivedAt + configManager.rttdelay + (configManager.addRandomness ? Math.round(Math.random() * 10) : 0);
    process.send({cmd: 'broadcast', event: 'transaction', data: transaction});
  },
  processTransactions: function () {
    // e-paxos phase 3
    const max = new Date().getTime();
    const times = Object.keys(process.data.transactions).filter(x => x < max);
    times.forEach(timestamp => {
      process.data.transactions[timestamp].forEach(transaction => {
        if(!transaction.passed && !transaction.failed){
          logManager.info(`${process.pid} processing transaction ${JSON.stringify(transaction)}`);

          if(process.data.users[transaction.source] && transaction.amount > 0){
            if(transaction.type === "deposit"){
              transaction.passed = true;
              process.data.users[transaction.source].balance += transaction.amount;
            } else if (transaction.type === "withdraw" && process.data.users[transaction.source].balance >= transaction.amount) {
              transaction.passed = true;
              process.data.users[transaction.source].balance -= transaction.amount;
            } else if(transaction.type === "transfer" && process.data.users[transaction.source].balance >= transaction.amount && process.data.users[transaction.target]) {
              transaction.passed = true;
              process.data.users[transaction.source].balance -= transaction.amount;
              process.data.users[transaction.target].balance += transaction.amount;
            }else{
              transaction.failed = true;
            }
          }else{
            transaction.failed = true;
          }
        }
      });
    });
  },
  getTotals: function(transactions, user){
    const times = Object.keys(transactions);
    const result = {
      failed: 0,
      passed: 0,
      total: 0,
      others: []
    };
    console.log(JSON.stringify(times));
    times.forEach(timestamp => {
      console.log(JSON.stringify(transactions[timestamp]));
      transactions[timestamp].forEach(transaction => {
        if(transaction.failed) result.failed++;
        else if(transaction.passed) result.passed++;
        else result.others.push(transaction);
        result.total++;
      });
    });
    return result;
  },

  getStatistics: function(req, res){
    const result = [];
    result.push({
      pid: process.pid,
      users: req.user.username === 'admin' ? process.data.users : [process.data.users[req.user.username]],
      totals: transactionManager.getTotals(process.data.transactions) 
    });
    return result;
  },
  getTransactions: function(user){
    logManager.info(`Getting transactions about user ${user.username}`);
    // logManager.info(`${JSON.stringify(process.data.history)}`);
    const username = user.username;
    const result = process.data.history.filter(x => [x.source, x.target].indexOf(username) > -1).sort((a, b) => { return b.arrivedAt - a.arrivedAt });
    return result;
  },
};
module.exports = transactionManager;
