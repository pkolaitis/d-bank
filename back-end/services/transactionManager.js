const transactionManager = {
  newTransaction: function (transaction) {
    console.log(`newTransaction arrived ${process.pid} ${JSON.stringify(transaction)}`);
    transaction.originator = process.pid;
    process.send({cmd: 'broadcast', data: transaction});
  },
  broadcastTransaction: function () {
    console.log('broadcastTransaction');
  },
};
module.exports = transactionManager;
