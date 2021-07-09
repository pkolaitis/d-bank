const configManager = require("./configManager");
const logManager = require("./logManager");

const transactionManager = {
  newTransaction: function (transaction) {
    logManager.info(`newTransaction arrived ${process.pid} ${JSON.stringify(transaction)}`);
    transaction.originator = process.pid;
    // adding a couple milliseconds randomly for each transaction to be delayed
    transaction.arrivedAt = transaction.arrivedAt || new Date().getTime();
    transaction.processAt = transaction.arrivedAt + configManager.rttdelay + (configManager.addRandomness ? Math.round(Math.random() * 10) : 0);
    process.send({cmd: 'broadcast', event: 'transaction', data: transaction});
  },
  processTransactions: function () {
    const max = new Date().getTime();
    const min = max - 2 * configManager.processWindow;
    const times = Object.keys(process.data.transactions).filter(x => x < max && x >= min);
    times.forEach(timestamp => {
      process.data.transactions[timestamp].forEach(transaction => {
        if(process.data.users[transaction.source] && transaction.amount > 0 && !transaction.passed){
        logManager.info(`${process.pid} processing transaction ${JSON.stringify(transaction)}`);
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
      });
    });
  },
  getTotalFailed: function(transactions, user){
    const times = Object.keys(transactions);
    const counter = 0;
    times.forEach(timestamp => {
      transactions[timestamp].forEach(transaction => {
        if(transaction.failed) counter++;
      });
    });
    return counter;
  },

  getTotalPassed: function(transactions, user){
    const times = Object.keys(transactions);
    const counter = 0;
    times.forEach(timestamp => {
      transactions[timestamp].forEach(transaction => {
        if(transaction.passed) counter++;
      });
    });
    return counter;
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
