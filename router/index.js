const express = require('express');
const DbStore = require('nedb');
const uuid = require('uuid/v4');
const router = express.Router();
const db = new DbStore({ autoload: true, filename: 'todo' });
function dbGetAll(res) {
  db.find({}, (err, doc) => {
    res.send(doc);
  });
}

function dbGetOne(res, _id) {
  db.findOne({ _id }, (err, doc) => {
    res.send(doc);
  });
}

router.get('/', (req, res) => {
  dbGetAll(res);
});

router.get('/:id', (req, res) => {
  dbGetOne(res, req.params.id);
});

router.post('/', (req, res) => {
  const id = uuid();
  const doc = {
    ...req.body,
    completed: false,
    _id: id,
    id,
    url: req.protocol + '://' + req.get('host') + '/' + id,
  };
  db.insert(doc, (err, doc) => {
    res.send(doc);
  });
});

router.patch('/:id', (req, res) => {
  db.update({ _id: req.params.id }, { $set: req.body }, {}, (err, number) => {
    dbGetOne(res, req.params.id);
  });
});

router.delete('/', (req, res) => {
  db.remove({}, { multi: true }, (err, n) => {
    dbGetAll(res);
  });
});

router.delete('/:id', (req, res) => {
  db.remove({ _id: req.params.id }, {}, (err, n) => {
    dbGetOne(res, req.params.id);
  });
});

module.exports = router;
