var db = require('../models/Database');

module.exports = {

  createEntry: function(req, res, next){

    // find the user with id = req.user.id
    let query = `MATCH (a:User) WHERE a.uuid = ${req.user.id}`; 
    // create an entry with the params from body (location and text)
    query = `CREATE (e:Entry ${req.body})`; 
    // create a Posted relationship between User and Entry
    query = `, (a)-[r:Posted]->(e)`;

    db.cp(query)
      .then(function() {
        res.send('Success');
      })
      .catch(function(err){
        res.status(404).json(err)
      })
  },

  getEntries: function(req, res, next) {
    let baseUserId = req.user.id.toString();
    let friendId = req.query.userID;

    // if this isn't a request for your own entries
    if (friendId && (friendId !== baseUserId)) {

        // check if req.query.userId is in friendlist
        let query = `MATCH (a:User)-[r:hasFriend]->(b:User)`;    
        query = `${query} WHERE a.uuid = ${baseUserId} AND b.uuid = ${friendId}`;
        // Return the relationship if they are
        query = `${query} RETURN (r)`;

        db.cp(query) 
            // ##CONFIRM RETURN VALUES OF THIS##
            .then(function(friends) {

        console.log('Result of isfriends? query, ', friends);

          if (friends) {
            // find entries posted by requested User
            let query = `MATCH (a:User)-[r:Posted]->(e:Entry)`;
            query = `${query} WHERE a.uuid = ${friendId}`;
            query = `${query} RETURN (e)`;
            // ##TODO## Sort by createdAt, descending
            db.cp(query)
              .then(function(entries){
                res.send(entries);
              })
              .catch(function(err){
                res.status(404).json(err)
              });
          } else {
            res.status(404).json({ error: 'you are not friends'})
          }
        })
        .catch(function(err) {
          res.status(404).json(err)
        });
    } else {
      // Find all entries by baseUserId
      let query = `MATCH (a:User)-[r:Posted]->(e:Entry)`;
      query = `${query} WHERE a.uuid = ${baseUserId}`;
      // And return them
      query = `${query} RETURN (e)`; 

      db.cp(query)
      .then(function(entries){
        res.send(entries);
      })
      .catch(function(err){
        res.status(404).json({error: 'Error retrieving entires: ' + err});
      });
    }
  }

};
