
const CONFIG = {
    REPLICAS: process.env.REPLICAS || require('os').cpus().length,
    DDELAY: process.env.DDELAY || 2000,
    PORT: process.env.PORT || 4201
};
module.exports = CONFIG;