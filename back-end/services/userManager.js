const users = require("../data/users");

const userManager = {
    userExists: function(username, password){
        return users.filter(x => x.username === username).length > 0;
    },
    isValidLoginInfo: function(username, password){
        return users.filter(x => x.username === username && x.password === password).length > 0;
    },
};

module.exports = userManager;