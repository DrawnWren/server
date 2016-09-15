let entries = require('../controllers/entryController');
let friends = require('../controllers/friendsController');
let requests = require('../controllers/requestController');
let users = require('../controllers/userController');

describe('/api/entries ', function() {

    it('should respond to GET requests with an array of Entry objects.', function(done) {
        /*[
          { 
            id: [integer],
            userId: [integer],
            text: [string],
            location: [string],
            createdAt: [timestamp],
            updatedAt: [timestamp] 
          }
        ]
         */

    });

    it('should response to POST requests with a 200 status code.', function(done) {

    });

    it('should properly Create and Fetch an entry.', function(done) {

        /*
      fetch('http://localhost:3000/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoidGVzdDUiLCJwYXNzd29yZCI6InBhc3MiLCJmdWxsbmFtZSI6ImhlbGxvIiwiY3JlYXRlZEF0IjoiMjAxNi0wOS0wNFQyMzo0MToyNS41NDJaIiwidXBkYXRlZEF0IjoiMjAxNi0wOS0wNFQyMzo0MToyNS41NDJaIn0.yjfFIaKJJxHzp5UPegVwzL9rMWXsALgLTo3emwJV0-w'
        },
        body: {
          text: 'Hello World!',
          location: 'San Francisco, California'
        }
      })

         */

    });
});

describe('/api/friends ', function() {
    it('should respond to a GET request with and array of user objects.', function(done) {
        /*[
          { 
            id: [integer],
            username: [string],
            fullname: [string],
          }
        ]
         */

    });
});

describe('/api/users ', function() {
    it('should respond to a GET request with an array of user objects that match the username param.', function(done) {
        /*[
              { 
                id: [integer],
                username: [string],
                fullname: [string],
              }
            ]
         */
    }); 

});
