const configManager = require("./configManager");
const logManager = require("./logManager");

const transactionManager = {
  newTransaction: function (transaction) {
    logManager.info(`newTransaction arrived ${process.pid} ${JSON.stringify(transaction)}`);
    transaction.originator = process.pid;
    // adding a couple milliseconds randomly for each transaction to be delayed
    transaction.processAt = new Date().getTime() + configManager.rttdelay + (configManager.addRandomness ? Math.round(Math.random() * 10) : 0);
    logManager.error(`${transaction.processAt} ${JSON.stringify(transaction)}`);
    process.send({cmd: 'broadcast', event: 'transaction', data: transaction});
  },
  processTransactions: function () {
    const max = new Date().getTime();
    const min = max - 2 * configManager.processWindow;
    const times = Object.keys(process.data.transactions).filter(x => x <= max && x >= min);
    times.forEach(timestamp => {
      process.data.transactions[timestamp].forEach(transaction => {
        logManager.info(`${process.pid} processing transaction ${JSON.stringify(transaction)}`);
        if(process.data.users[transaction.source] && transaction.amount > 0){
          if(transaction.type === "deposit"){
            process.data.users[transaction.source].amount += transaction.amount;
            transaction.passed = true;
          } else if (transaction.type === "withdraw" && process.data.users[transaction.source].amount >= transaction.amount) {
            process.data.users[transaction.source].amount -= transaction.amount;
            transaction.passed = true;
          } else if(transaction.type === "transfer" && process.data.users[transaction.source].amount >= transaction.amount && process.data.users[transaction.target]) {
            process.data.users[transaction.source].amount -= transaction.amount;
            process.data.users[transaction.target].amount += transaction.amount;
            transaction.passed = true;
          }else{
            transaction.failed = false;
          }
        }else{
          transaction.failed = false;
        }
      });
    });
  },
};
module.exports = transactionManager;
