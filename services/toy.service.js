const utilService = require('./util.service')
const fs = require('fs')
const gToys = require('../data/toy.json')
const PAGE_SIZE = 5

module.exports = {
    query,
    getById,
    save,
    remove
}

function query(filterBy = { txt: '' }) {
    const regex = new RegExp(filterBy.txt, 'i')
    let toys = gToys.filter(toy => regex.test(toy.name))

    if (filterBy.userId) {
        toys = toys.filter(toy => filterBy.userId === toy.owner._id)
    }
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        toys = toys.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(toys)
}

function getById(toyId) {
    const toy = gToys.find(toy => toyId === toy._id)
    return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    // if (!loggedinUser.isAdmin && gToys[idx].creator._id !== loggedinUser._id) {
    //     return Promise.reject('Not your Toy')
    // }
    gToys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy, loggedinUser) {
    if (toy._id) {
        const toyToUpdate = gToys.find(currToy => currToy._id === toy._id)

        // if (!loggedinUser.isAdmin && toyToUpdate.creator._id !== loggedinUser._id) {
        //     return Promise.reject('Not your Toy')
        // }

        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        toy.labels = ["Doll", "Battery Powered", "Baby"]
        toy.reviews = [
            {
                "name": "Lee Sharon",
                "rate": 5,
                "txt": "Best toy ever",
                "createdAt": 1662478931155
            },
            {
                "name": "Puki D.",
                "rate": 3,
                "txt": "It breaks easily..",
                "createdAt": 1662478931155
            },
            {
                "name": "Shula F.",
                "rate": 4,
                "txt": "My kid loves to play with it",
                "createdAt": 1662478931155
            }
        ]
        gToys.push(toy)
    }
    return _saveToysToFile()
        .then(() => toy)
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gToys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) return reject('Cannot save to file')
            resolve()
        })
    })
}