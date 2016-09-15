var db = require('../models/Database.js');

module.exports = {
  sendRequest: function(req, res, next) {
   let query = `MATCH (a:User), (b:User) WHERE a.uuid = '${req.user.id}' AND b.uuid = '${req.body.requestReceiver}'`;
    query = `${query} CREATE (a)-[r:wantsFriend]->(b)`;
    query = `${query} RETURN (r)`;
    db.cp(query)
      .then(function(){
          res.status(201).send("Success");
      })
      .catch(function(err){
        res.status(404).json(err)
      });
  },

  getRequests: function(req, res, next) {
      /*
    db.Request.findAll({
      where: { requestReceiver: req.user.id, status: 'CREATED' },
      include: {
        model: db.User,
        attributes: ['fullname']
      }
    }) */
    let query = `MATCH (a)-[r:wantsFriend]->(b) WHERE b.uuid = '${req.user.id}' RETURN (r)`; 
    db.cp(query)
      .then(function(requestList) {
        res.status(200).json(requestList);
      })
      .catch(function(err) {
        res.status(404).json(err);
      });
  },

  acceptRequest: function(req, res, next) {
    // find a request with requestId and user ids
    let query = `MATCH (a:User)-[r:wantsFriend]->(b:User)`;
    query = `${query} WHERE b.uuid = '${req.user.id}'`; 
    query = `${query} AND r.uuid = '${req.body.requestId}'`;
    // remove the wantsFriend relationship 
    query = `${query} DELETE (r)`;
    // then create a two way friendship
    query = `${query} CREATE (a)-[r:hasFriend]->(b)`;
    query = `${query} (b)-[y:hasFriend]->(a)`;
    query = `${query} RETURN (r)`;
    db.cp(query)
      .then(function(){
          res.status(201).send("Success");
      })
      .catch(function(err){
           res.status(404).json(err)
      });
  }, 

  rejectRequest: function(req, res, next) {
    // find a request with requestId and user ids
    let query = `MATCH (a:User)-[r:wantsFriend]->(b:User)`;
    query = `${query} WHERE r.uuid = '${req.body.requestId}'`; 
    // delete it
    query = `${query} DELETE (r)`;
    db.cp(query)
      .then(function(){
              res.status(201).send("Success");
      })
      .catch(function(err){
        res.status(404).json({ error: "The request was not found in the database. Error message: " + err });
      });
  }
}
