var db = require('../models/Database.js');
var jwt = require('jwt-simple');

module.exports = {

  createUser : function(req, res, next){
  /*
    db.User.create(req.body)
      .then(function(newUser){
        var token = jwt.encode(newUser, 'secret');
        res.status(201).json({
          token: token
        })
      })
      .catch(function(err){
        res.status(404).json(err)
      })
  */
  },

  findUser: function(req, res, next){
    var username = req.query.username;
    if (!username) {
      return res.status(200).json([]);
    }
   query = `MATCH (user {username: ${username}})`;
   db.cp({query, cb}).then( d => {
       res.json(d);
   }).catch( e => next(e) ); 
  },

  signIn: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOne({ where: {username: username}} )
     .then(function (user) {
        if (!user) {
          res.status(404).json({ error: 'User does not exist' })
        } else {
            if (password === user.password){
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
