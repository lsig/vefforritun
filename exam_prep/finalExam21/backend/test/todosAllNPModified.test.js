//Importing the application to test
let server = require('../todosAllNPModified');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let apiUrl = "http://localhost:3000";

describe('Note endpoint tests', () => {
    beforeEach((done) => {
        server.resetServerState();
        done();
    });
    
    it("Get /api/vEx0/notes success", function (done) {
        chai.request(apiUrl)
            .get('/api/vEx0/notes')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });
});