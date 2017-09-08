var express = require('express');
var router = express.Router();
var io = require('socket.io');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
