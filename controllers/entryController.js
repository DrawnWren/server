var db = require('../models/Database');

module.exports = {

  createEntry: function(req, res, next){
    console.log('Create entry request user : ', req.user.id);
    console.log('Entry object : ', req.body);
    // find the user with id = req.user.id
    let query = `MATCH (a:User) WHERE a.uuid = '${req.user.properties.uuid}'`; 
    // create an entry with the params from body (location and text)
    const now = Date.now();
    query = `${query} CREATE (e:Entry {text: '${req.body.text}',createdAt: '${now}', location: '${req.body.location}'})`;
    // create a Posted relationship between User and Entry
    query = `${query} , (a)-[r:Posted]->(e)`;
    query = `${query} RETURN e`;

    db.cp(query)
      .then(function() {
        res.send('Success');
      })
      .catch(function(err){
        console.log('Create entry error, ', err);
        res.status(404).json(err)
      })
  },

  getEntries: function(req, res, next) {
    let baseUserId = req.user.properties ? req.user.properties.uuid.toString() : null;
    let friendId = req.query.userID;
    // if this isn't a request for your own entries
    if (friendId && (friendId !== baseUserId)) {

        // check if req.query.userId is in friendlist
        let query = `MATCH (a:User)-[r:hasFriend]->(b:User)`;    
        query = `${query} WHERE a.uuid = '${baseUserId}' AND b.uuid = '${friendId}'`;
        // Return the relationship if they are
        query = `${query} RETURN r`;

        db.cp(query) 
            // ##CONFIRM RETURN VALUES OF THIS##
            .then(function(friends) {

        console.log('Result of isfriends? query, ', friends);

          if (friends) {
            // find entries posted by requested User
            let query = `MATCH (a:User)-[r:Posted]->(e:Entry)`;
            query = `${query} WHERE a.uuid = '${friendId}'`;
            query = `${query} RETURN e`;
            // ##TODO## Sort by createdAt, descending
            db.cp(query)
              .then(function(entries){
                const results = entries.length > 0 ? entries.map((entry) => entry.e.properties) : [];
                res.send(results);
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
      query = `${query} WHERE a.uuid = '${baseUserId}'`;
      // And return them
      query = `${query} RETURN e`; 
      db.cp(query)
      .then(function(entries){
        let results = entries.length > 0 ? entries.map((entry) => entry.e.properties) : [];
        results = results.map((result) => {
            return {
                id: result.uuid,
                userID: baseUserId,
                text: result.text, 
                location: result.location,
                createdAt: parseInt(result.createdAt),
            };
        });
        console.log('Sending results for entries, ', results);
        res.send(results);
      })
      .catch(function(err){
        console.log('Failed to retrieve own entries, ', err);
        res.status(404).json({error: 'Error retrieving entires: ' + err});
      });
    }
  }

};
