const DB = require('../lib/db');
const ChannelProgramming = require('../lib/channel-programming');

/*
	timebox is the amount of time in the future 
	from when generateProgramming runs you want
	to create timeslots
*/

const db = new DB();

async function generateProgramming(channelId, timebox, cb) {

	db.setTable('channel');
	const channel = await db.getRows({ id: channelId });
	console.log(`-- Generating programming for channel '${channel[0].name}'#${channel[0].id} --`);
	
	db.setTable('channel_video');
	const channelVideos = await db.getRows({ channel_id: channelId });
	
	db.setTable('channel_timeslot');
	let timeSeriesId = await db.getMax({ channel_id: channelId }, 'time_series_id');
	timeSeriesId = timeSeriesId[0]['max(`time_series_id`)'];
	if (!timeSeriesId) timeSeriesId = 0;
	const channelProgramming = new ChannelProgramming(channelVideos);
	const timeSlots = channelProgramming.createTimeSlots(timebox);
	console.log("-- Time slots created --");

	await saveTimeSlots(timeSlots, timeSeriesId);

	cb();
}

function saveTimeSlots(timeSlots, timeSeriesId) {
	db.setTable('channel_timeslot');
	return new Promise((resolve, reject) => {
		const insertPromises = [];
		timeSlots.forEach((timeSlot, i) => {
			insertPromises.push(db.insertRow({
				'channel_id': timeSlot.channel_id,
				'channel_video_id': timeSlot.id,
				'video_start_ts': timeSlot.video_start_ts,
				'time_series_id': timeSeriesId+(i+1),
			}).catch((err) => {
				console.log("Insert error", err);
			}));
		});
		Promise.all(insertPromises).then((rowIds) => {
			console.log(`-- Inserted ${rowIds.length} rows into channel_timeslot --`);
			resolve();
		})
		.catch((err) => {
			reject("Save error:", err);
		});
	});
}

const args = process.argv.slice(2);
if (args.length == 2) {
	generateProgramming(args[0], args[1], () => {
		console.log("-- Programming generated --");
		process.exit(0);
	});	
} else {
	console.log("Argument error: generate-programming.js <channelId> <timebox>");
}