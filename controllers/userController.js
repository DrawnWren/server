var db = require('../models/Database');
var jwt = require('jwt-simple');

module.exports = {

  createUser : function(req, res, next){
    // I expect req.body to turn into '{username: $username, password:
    // $password, fullname: $fullname }
    query = `CREATE (n:User { username: '${req.body.username}',`;
    query = `${query}  password: '${req.body.password}', fullname: '${req.body.fullname}'})`;
    query = `${query} RETURN n`;
    db.cp(query).then(() =>  db.findByUsername(req.body.username).then((newUser) => {
            console.log('New user is, ', newUser);
            var token = jwt.encode(newUser[0].a, 'secret');
            res.status(201).json({token: token });
        });
    )
    .catch( e => next(e) );
  },

  findUser: function(req, res, next){
    var username = req.query.username;
    if (!username) {
      return res.status(200).json([]);
    }
   db.findByUsername(username).then( d => {
       // if there were no users found, send an empty array
       d = d[0] ? d[0].a.properties : [];
       d.id = d.uuid;
       delete d.uuid;
       delete d.password;
       res.json([d]);
   }).catch( e => next(e) ); 
  },

  signIn: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    db.findByUsername(username)
     .then(function (user) {
        if (!user) {
          res.status(404).json({ error: 'User does not exist' })
        } else {
            //Neo4j library returns an array of results, keyed by the variable
            //name in query
            console.log('Result of findByUsername : ', user);
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
          console.log('User signup error, ', err);
        res.json(err);
      })
  }

};
