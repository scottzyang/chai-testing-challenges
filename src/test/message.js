require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})


describe('Message API endpoints', () => {
    beforeEach( async () => {
        // TODO: add any beforeEach code here
        const userTest = new User({
            username: "usertest",
            password: "password"
        })

        await userTest.save();

        const messageTest = new Message({
            title: "MessageTest",
            body: "This is a Message Body Test",
            author: userTest,
        })

        await messageTest.save();
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        Message.deleteMany({title: "MessageTest"});

        User.deleteMany({ username: "usertest" });

        done();
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
            .get('/messages')
            .end((err, res) => {
                if (err) { done(err) }
                expect(res).to.have.status(200);
                expect(res.body.messages).to.be.an("array");
                done();
            })
    })

    it('should get one specific message', (done) => {
        Message.findOne({ title: "MessageTest" })
            .then((message) => {
                chai.request(app)
                    .get(`/messages/${message._id}`)
                    .end((err, res) => {
                        if (err) { done(err) }
                        expect(res).to.have.status(200)
                        expect(res.body.message).to.be.an("object")
                        expect(res.body.message.title).to.equal("MessageTest")
                        expect(res.body.message._id).to.equal(message._id.toString())
                        done()
                    })
            })
    })

    it('should post a new message', (done) => {
        User.findOne({ username: "usertest" })
            .then((user) => {
                chai.request(app)
                    .post("/messages")
                    .send({
                        title: "Test Title",
                        body: "Test Message",
                        author: user._id.toString()
                    })
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an("object")
                        expect(res.body.author).to.equal(user._id.toString())
                        done()
                    })
            })
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        Message.findOne({ title: "MessageTest" })
            .then((message) => {
                chai.request(app)
                    .put(`/messages/${message._id}`)
                    .send({
                        body: "let's change this"
                    })
                    .end((err, res) => {
                        if (err) { done(err) }
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an("object")
                        expect(res.body.message.body).to.equal("let's change this")
                        expect(res.body.message._id).to.equal(message._id.toString())
                        done()
                    })
            })
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        Message.findOne({ title: "MessageTest" })
            .then((message) => {
                chai.request(app)
                    .delete(`/messages/${message._id}`)
                    .end((err, res) => {
                        if (err) { done(err) }
                        expect(res).to.have.status(200)
                        expect(res.body.message).to.equal("Successfully removed")
                        done()
                    })
            })
    })
})
