const users = require("../data/users");

const userManager = {
    userExists: function(username){
        for(const id in users){
            if(users[id].username === username){
                return users[id];
            }
        }
        return null;
    },
    isValidLoginInfo: function(username, password){
        for(const id in users){
            if(users[id].username === username && users[id].password === password){
                return users[id];
            }
        }
        return null;
    },
};

module.exports = userManager;