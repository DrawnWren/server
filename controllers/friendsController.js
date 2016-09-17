var db = require('../models/Database');

module.exports = {

  fetchFriends: function(req, res, next){
    // Find all friends and return 
    // an array of User objects
    const userId = req.user.properties ? req.user.properties.uuid : null;
    let query = `MATCH (a:User)-[r:hasFriend]->(b:User)`;
    query = `${query} WHERE a.uuid = '${req.user.properties.uuid}'`;
    query = `${query} RETURN b.uuid AS id, b.username AS username, b.fullname AS fullname`;
    db.cp(query)
     .then(function(friendList){
        res.status(201).json(friendList)
      })
      .catch(function(err){
        console.log('Failed to fetch friends, for uuid ', req.user.properties.uuid);
        console.log(err);
        res.status(404).json(err)
      })
  },

/*  Shouldn't be in use 
 *  acceptFriendReq: function(req, res, next){
    var reverse = {
      user1: req.body.user2,
      user2: req.body.user1
    }

    var query = [req.body,reverse]

    db.Relationships.bulkCreate(query)
      .then(function(){
        return db.Relationships.findAll()
      })
      .then(function(relationships){
        res.status(201).send("Success")
      })
      .catch(function(err){
        res.status(404).json(err)
      })
  },
*/
}
