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

const USER_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string
const MESSAGE_OBJECT_ID = 'bbbbbbbbbbbb'

describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
        const messages = new Message({
            title: "MessageTest",
            body: "This is a Message Body Test",
            author: USER_OBJECT_ID,
            _id: MESSAGE_OBJECT_ID,
        })
        messages.save()
        .then(() => {
            done()
        })
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        Message.deleteMany({title: "MessageTest"})
        .then(() => {
            done()
        })
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.messages).to.be.an("array")
            done()
        })
        done()
    })

    it('should get one specific message', (done) => {
        chai.request(app)
        .get(`/messages/${MESSAGE_OBJECT_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body.title).to.equal('MessageTest')
            expect(res.body.body).to.equal('This is a Message Body Test')
            done()
        })
        done()
    })

    it('should post a new message', (done) => {
        done()
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        done()
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        done()
    })
})
