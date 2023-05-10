const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', async (req, res) => {
    // TODO: Get all Message objects using `.find()`
    try {
        const messages = await Message.find();
        return res.json({ messages })
    } catch (err) {
        return res.json({ message: err.message });
    }

})

/** Route to get one message by id. */
router.get('/:messageId', async (req, res) => {
    // TODO: Get the Message object with id matching `req.params.id`
    // using `findOne`
    try {
        const message = await Message.findById(req.params.messageId);
        return res.json({ message });
    } catch (err) {
        return res.json({ message: err.message });
    }

    // TODO: Return the matching Message object as JSON
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(message => {
        return User.findById(message.author)
    })
    .then(user => {
        // console.log(user)
        user.messages.unshift(message)
        return user.save()
    })
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', async (req, res) => {
    // TODO: Update the matching message using `findByIdAndUpdate`
    try {
        const message = await Message.findByIdAndUpdate(req.params.messageId, req.body);
        const updatedMessage = await Message.findById(req.params.messageId);
        return res.json({ message: updatedMessage });
    } catch (err) {
        return res.json({ message: err.message });
    }
    // TODO: Return the updated Message object as JSON
})

/** Route to delete a message. */
router.delete('/:messageId', async (req, res) => {
    // TODO: Delete the specified Message using `findByIdAndDelete`. Make sure
    // to also delete the message from the User object's `messages` array
    try {
        const message = await Message.findByIdAndDelete(req.params.messageId);
        return res.json({ message: "Successfully removed" });
    } catch (err) {
        res.json({message: err.message});
    }

    // TODO: Return a JSON object indicating that the Message has been deleted
})

module.exports = router
