var neo4j = require('neo4j');

var Promise = require('bluebird');

console.log(`DB URI is ${process.env.db}`);

var db = new neo4j.GraphDatabase({
    url: process.env.db, //db environment var should be http://localhost:7474 if running local
        headers: {},    // optional defaults, e.g. User-Agent
});

// Promisified cypher. Because CBs suck
db.cp = function (query) {
    return new Promise((fulfill, reject) => {
        db.cypher(query, function(err, res) {
            if (err) reject(err)
            else fulfill(res);
        });
    });
} 

db.findByUsername = function(username) { 
    let query = `MATCH (a:User {username: '${username}'})`;
    query = `${query} RETURN a`;
    return db.cp(query);
}

module.exports = db;
/*
// Define the model that corresponds to the entry table in the database.
var User = sequelize.define('user', {
  username: {type: Sequelize.STRING, unique: true },
  password: Sequelize.STRING,
  fullname: Sequelize.STRING
});

// Define the model that corresponds to the entry table in the database.
var Entry = sequelize.define('entry', {
  text: Sequelize.STRING,
  location: Sequelize.STRING
});

var Relationships = sequelize.define('relationships', {
  user1: Sequelize.INTEGER,
  user2: Sequelize.INTEGER
});

var Request = sequelize.define('request', {
  requestReceiver: Sequelize.INTEGER,
  status: Sequelize.STRING
}, {
  validate: {
    requestReceiverMustNotBeFriend: function(next) {
      Relationships.findOne({
        where: { user1: this.userId, user2: this.requestReceiver }
      })
        .then(function(friends){
          if (friends) {
            next('requestReceiver must NOT be a friend');
          } else {
            next();
          }
        })
    },
    mustNotBeDuplicateRequest: function(next) {
      Request.findOne({ where: {
        userId: this.userId,
        requestReceiver: this.requestReceiver,
        status: this.status
      } })
        .then(function(exists) {
          if (exists) {
            next('Request already exists');
          } else {
            next();
          }
        })
    }
  }
})

// puts a UserId column on each Entry instance
// also gives us the `.setUser` method available
// after creating a new instance of Entry
Entry.belongsTo(User)
Request.belongsTo(User)

User.hasMany(Entry);
User.hasMany(Request);


User.sync();
Entry.sync();
Relationships.sync();
Request.sync()
*/
