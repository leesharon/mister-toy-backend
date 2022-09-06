const express = require('express')
const toyService = require('../../services/toy.service')
const userService = require('../../services/user.service')
const router = express.Router()

module.exports = router

// LIST
router.get('/', (req, res) => {
    const { txt, pageIdx, userId } = req.query
    const filterBy = { txt: txt || '' }
    if (pageIdx) filterBy.pageIdx = pageIdx
    if (userId) filterBy.userId = userId

    toyService.query(filterBy)
        .then(toys => res.send(toys))
})

// READ
router.get('/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then(toy => res.send(toy))
})

// CREATE
router.post('/', (req, res) => {
    // const loggedinUser = userService.validateToekn(req.cookies.logginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add toy')

    // console.log('POST REQ from user', loggedinUser)

    const toy = req.body
    // toy.creator = loggedinUser
    toyService.save(toy)
        .then(toy => res.send(toy))
})

// UPDATE
router.put('/:toyId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.logginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot Update Toy')

    const toy = req.body
    toyService.save(toy, /*loggedinUser*/)
        .then(toy => res.send(toy))
        .catch((err) => {
            console.log('error', err)
            res.status(400).send('Cannot update toy')
        })
})

// DELETE
router.delete('/:toyId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.logginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot remove toy')

    const { toyId } = req.params
    toyService.remove(toyId, /*loggedinUser*/)
        .then(() => res.send({ msg: 'Removed Successfully' }))
        .catch((err) => {
            console.log('error', err)
            res.status(400).send('Cannot remove toy')
        })
})