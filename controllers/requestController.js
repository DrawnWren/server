var db = require('../models/Database.js');

module.exports = {
  sendRequest: function(req, res, next) {
   let query = `MATCH (a:User), (b:User) WHERE a.uuid = '${req.user.properties.uuid}' AND b.uuid = '${req.body.requestReceiver}'`;
    query = `${query} MERGE (a)-[r:wantsFriend]->(b)`;
    query = `${query} RETURN r`;
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
      where: { requestReceiver: req.user.properties.uuid.user.id, status: 'CREATED' },
      include: {
        model: db.User,
        attributes: ['fullname']
      }
    }) */

    console.log('Req is ,' , req.user);
    let query = `MATCH (a)-[r:wantsFriend]->(b) WHERE b.uuid = '${req.user.properties.uuid}' RETURN r.uuid AS id, a.uuid AS userId, a.fullname, a.username`; 
    db.cp(query)
      .then((requestList) => {
        requestList = requestList.map((request) => {
            request.requestReceiver = req.user.properties.uuid;
            request.user = { fullname: request['a.fullname'], username: request['a.username'] };
            request.createdAt = Date.now();
            request.updatedAt = Date.now();
            
            delete request['a.fullname'];
            delete request['a.username'];
            
            return request;
        }); 
        console.log('Requests list is , ', requestList);
        res.status(200).json(requestList);
      })
      .catch(function(err) {
        console.log('Friend request error , ', err);
        res.status(404).json(err);
      });
  },

  acceptRequest: function(req, res, next) {
    // find a request with requestId and user ids
    let query = `MATCH (a:User)-[r:wantsFriend]->(b:User)`;
    query = `${query} WHERE b.uuid = '${req.user.properties.uuid}'`; 
    query = `${query} AND r.uuid = '${req.body.requestId}'`;
    // remove the wantsFriend relationship 
    query = `${query} DELETE r`;
    // then create a two way friendship
    query = `${query} CREATE (a)-[x:hasFriend]->(b), `;
    query = `${query} (b)-[y:hasFriend]->(a)`;
    query = `${query} RETURN r`;
    console.log('Accept request query is ,', query);
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
