const entries = require('../controllers/entryController');
const chai = require('chai');
const chaiHttp = require('chai-http');
const friends = require('../controllers/friendsController');
const requests = require('../controllers/requestController');
const users = require('../controllers/userController');
const server = require('../server');

chai.use(chaiHttp);
const testHeaders = { 'Content-Type': 'application/json','x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoidGVzdDUiLCJwYXNzd29yZCI6InBhc3MiLCJmdWxsbmFtZSI6ImhlbGxvIiwiY3JlYXRlZEF0IjoiMjAxNi0wOS0wNFQyMzo0MToyNS41NDJaIiwidXBkYXRlZEF0IjoiMjAxNi0wOS0wNFQyMzo0MToyNS41NDJaIn0.yjfFIaKJJxHzp5UPegVwzL9rMWXsALgLTo3emwJV0-w'};

const testentry = { text: 'Hello World!', location: 'San Francisco, California' };



describe('/api/entries ', (done) => {

    it('should respond to GET requests with an array of Entry objects.', () => {
        chai.request(server)
        .get('/api/entries')
        .then((res) => {
            assert(res).to.be.an.array();
        });
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

    it('should response to POST requests with a 200 status code.', () => {
        chai.request(server)
        .post('/api/entries')
        .header(testHeaders)
        .send(testEntry)
        .then((res) => {
            assert(res).to.have.status(200);
        });
    });
});

describe('/api/friends ', () => {
    it('should respond to a GET request with an array of user objects.', () => {
        chai.request(server)
        .get('/api/entries')
        .then((res) => {
            expect(res.body).to.be.an.array();
        })
        

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

describe('/api/users ', () => {
    it('should respond to a GET request with an array of user objects that match the username param.', () => {
        chai.request(server)
        .get('/api/users')
        .then((res) => {
            expect(res.body).to.be.an.array();
        });
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

describe('/api/friendreq ', () => {

    it('shoudl respond to a GET request with an array of all inbound friend requests', () => {
        /*[
          {
                id: [integer],
            requestReceiver: [integer],
            createdAt: [timestamp],
            updatedAt: [timestamp],
            userId: [integer],
            user: {
              fullname: [string]
            }
          }
        ]
         */
    });

    it('should respond to a POST request with a 201 status code.', () => {
        chai.request(server)
        .post('/api/friendreq')
        .send()
        .then((res) => {
            expect(res).to.have.status(201);
        });
        /*fetch('http://localhost:3000/api/friendreq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoidGVzdDUiLCJwYXNzd29yZCI6InBhc3MiLCJmdWxsbmFtZSI6ImhlbGxvIiwiY3JlYXRlZEF0IjoiMjAxNi0wOS0wNFQyMzo0MToyNS41NDJaIiwidXBkYXRlZEF0IjoiMjAxNi0wOS0wNFQyMzo0MToyNS41NDJaIn0.yjfFIaKJJxHzp5UPegVwzL9rMWXsALgLTo3emwJV0-w'
    },
    body: {
      requestReceiver: 25,
    }
  })
         */
    });

    it('should respond to a DELETE request with a 201 status code.', () => {
        chai.request(server)
        .delete('/api/friendreq')
        .send()
        .then((res) => {
            expect(res).to.have.status(201);
        });

    });

    xit('should properly delete a friend request.', () => {
        
    });

    xit('should properly accept a friend request.', () => {

    });
});
