const fetchChannelVideos = require('../scripts/fetch-channel-videos');
const generateProgramming = require('../scripts/generate-programming');

const DB = require('../lib/db');
const express = require('express');
const router = express.Router();

const db = new DB();
/* GET home page. */
router.get('/', async function(req, res, next) {
  db.setTable('channel');
  const channels = await db.getAllRows();
  const liveChannelPromises = channels.map((channel) => {
  	return db.getLiveChannels(channel.id);
  });
  Promise.all(liveChannelPromises).then(async (liveChannels) => {
  	const liveChannelsMap = {};

  	db.setTable('topic');
  	for (let i = 0; i < liveChannels.length; i++) {
  		liveChannel = liveChannels[i][0];

			const videoStartTs = new Date(liveChannel.video_start_ts).getTime();
			const currentTs = new Date().getTime() - videoStartTs;

			topics = await db.getRows({ channel_id: liveChannel.channel_id });

			topicNames = topics.map((topic) => {
				return topic.name;
			});

			liveChannelsMap[liveChannel.channel_id] = {
				channelId: liveChannel.channel_id,
				name: liveChannel.name,
				currentVideoName: liveChannel.title,
				video_url: liveChannel.video_url,
				video_start_ts: videoStartTs,
				current_ts: currentTs,
				tags: topicNames
			};
		};
    res.render('layout', { title: 'not.tv', page: 'home', channels: liveChannelsMap });
  }).catch((err) => {
	console.log(err);
	res.render('layout', { title: 'not.tv', page: 'home', channels: [] });
  });
});

router.post('/api/create-channel', async function(req, res, next) {
	db.setTable('channel');
	const { name, tags } = req.body;
	
	const foundChannel = await db.getChannelByName(name);

	if (foundChannel.length > 0) {
		return res.status(409).end(JSON.stringify({
			errorMessage: 'Channel name already exists'
		}));
	};

	try {
		const channelInfo = await db.insertRow({ name });
		const channelId = channelInfo[0];

		const topics = tags;
		db.setTable('topic');
		for (let i = 0; i < topics.length; i++) {
			const topic = topics[i];
			const topicInfo = await db.insertRow({ name: topic, channel_id: channelId });
			const topicId = topicInfo[0];
			console.log(`Topic '${topic}'#${topicId} created`);		
		};

		await fetchChannelVideos(channelId);	

		const timebox = 24;
		generateProgramming(channelId, timebox, () => {
			res.status(200).end(JSON.stringify({
				success: true
			}));	
		});
	} catch(e) {
		console.log('error', e);

		db.setTable('channel_timeslot');
		await db.removeByChannelId(channelId);
		db.setTable('channel_video');
		await db.removeByChannelId(channelId);
		db.setTable('topic');
		await db.removeByChannelId(channelId);
		db.setTable('channel');
		await db.removeById(channelId);

		console.log('removed from DB');

		return res.status(500).end(JSON.stringify({
			errorMessage: 'There was a problem creating the channel, try again'
		}));
	}
});


module.exports = router;
