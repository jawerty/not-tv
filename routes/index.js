const DB = require('../lib/db');
const express = require('express');
const router = express.Router();

const db = new DB();
/* GET home page. */
router.get('/', async function(req, res, next) {
  db.setTable('channel');
  const channels = await db.getAllRows();
  console.log(channels);
  const liveChannelPromises = channels.map((channel) => {
  	return db.getLiveChannels(channel.id);
  });

  Promise.all(liveChannelPromises).then((liveChannels) => {
  		console.log(liveChannels);
  		next();
  	}).catch((err) => {
  		console.log(err);
  		next();
  	});
  // res.render('layout', { title: 'not.tv', page: 'home', channels });

});

module.exports = router;
