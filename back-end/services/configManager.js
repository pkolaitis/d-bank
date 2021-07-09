const configManager = {
  replicas: 2 || process.env.replicas || require('os').cpus().length,
  ddelay: process.env.ddelay || 2000,
  port: process.env.port || 4201,
  rttdelay: process.env.rttdelay || 20,
  pdelay: process.env.pdelay || 2000,
  addRandomness: process.env.addRandomness || true,
  processWindow: process.env.processWindow || 20,
  superpass: process.env.superpass || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiMjAyMS0wNy0wOFQxNTowNToxNS44MDhaIiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2MjU3NTY3MTV9.R0PYYpPW2-flxAyxNpU8melSbb_Zz_3ns2Zm7PQ0Iy8"
};
module.exports = configManager;
