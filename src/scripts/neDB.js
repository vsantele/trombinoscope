const Datastore = require('nedb');
const {app} = require('electron')
const path = require('path');
console.log('path :', app.getPath('userData'));
// const dbFolder = path.resolve(__dirname, '..', 'data')
const dbFolder = app.getPath('userData')
const dbFile = path.join(dbFolder, 'data.db')

const db = new Datastore({filename: dbFile, autoload: true});

const create = async (name, photo, com) => {
  const doc = {
    name: name,
    photo: photo,
    comment: com
  }
  return new Promise((resolve, reject) => {
    db.insert(doc, (err, newDoc)=>{
      if (err) reject(err)
      resolve(newDoc._id)
    })
  }) 
}

const read = (id) => {
  return new Promise((resolve, reject) => {
    db.findOne({_id: id}, (err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

const readAll = () => {
  return new Promise((resolve, reject)=> {
    db.find({}).sort({name: 1}).exec((err, docs)=> {
      if (err) reject(err)
      // console.log('docs :', docs);
      resolve(docs)
    })
  })
}

const delIds = (ids) => {
  ids.forEach(id => {
    db.remove({_id: id})
    console.log(id + " removed")
  });
}

const delId = id => {
  return new Promise((resolve, reject) => {
    db.remove({_id: id}, (err, nb) => {
      if (err) reject(err)
      resolve(true)
    })
  })
}

const update = (id, name, photo, com) => {
  const doc = {
    name: name,
    photo: photo,
    comment: com
  }
  return new Promise((resolve, reject) => {
    db.update({_id: id}, doc, {}, (err, num) => {
      if (err) reject(err)
      resolve(true)
    })
  })
}

module.exports.create = create
module.exports.readAll = readAll
module.exports.delId = delId
module.exports.delIds = delIds
module.exports.update = update
module.exports.read = read
