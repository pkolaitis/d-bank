const configManager = {
  replicas: process.env.replicas || require('os').cpus().length,
  ddelay: process.env.ddelay || 2000,
  port: process.env.port || 4201,
  rttdelay: process.env.rttdelay || 10,
  pdelay: process.env.pdelay || 2000,
  superpass: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
};
module.exports = configManager;
