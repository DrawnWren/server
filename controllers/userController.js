var db = require('../models/Database');
var jwt = require('jwt-simple');

module.exports = {

  createUser : function(req, res, next){
    // I expect req.body to turn into '{username: $username, password:
    // $password, fullname: $fullname }
    query = `CREATE (n:User {username: '${req.body.username}',`;
    query = `${query}  password: '${req.body.password}', fullname: '${req.body.fullname}'})`;
    db.cp(query).then( newUser => {
        var token = jwt.encode(newUser, 'secret');
        res.status(201).json({
            token: token
        })
    })
    .catch( e => next(e) );
  },

  findUser: function(req, res, next){
    var username = req.query.username;
    if (!username) {
      return res.status(200).json([]);
    }
   db.findByUsername(username).then( d => {
       d = d[0].a;
       res.json(d);
   }).catch( e => next(e) ); 
  },

  signIn: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    let query = ``;

    db.findByUsername(username)
     .then(function (user) {
        if (!user) {
          res.status(404).json({ error: 'User does not exist' })
        } else {
            //Neo4j library returns an array of results, keyed by the variable
            //name in query
            user = user[0].a;
            if (password === user.properties.password){
              var token = jwt.encode(user, 'secret');
              res.json({token: token});
            } else {
                res.status(401).json({error: 'Incorrect password'})
            }
        }
      })
      .catch(function(err){
        res.json(err);
      })
  }

};
