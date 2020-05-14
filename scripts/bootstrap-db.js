const DB = require('../lib/db');

const db = new DB();

async function createTables(cb) {
	await db.createTable('channel', {
		'name': { type: 'string' },
	}).then((info) => {
		console.log('channel table created')
	}).catch((err) => {
		console.log(err);
	});

	await db.createTable('channel_video', {
		'channel_id': { type: 'unsigned_integer',  isForeign: true, foreignKey: 'channel.id' },
		'title': { type: 'string' },
		'creator_name': { type: 'string' },
		'creator_url': { type: 'string' },
		'video_url': { type: 'string' },
		'rating': { type: 'float' },
		'duration': { type: 'integer' },
		'fetched_at': { type: 'timestamp_now' },
	}).then((info) => {
		console.log('channel_video table created')
	}).catch((err) => {
		console.log(err);
	});

	await db.createTable('channel_timeslot', {
		'channel_id': { type: 'unsigned_integer', isForeign: true, foreignKey: 'channel.id' },
		'channel_video_id': { type: 'unsigned_integer', isForeign: true, foreignKey: 'channel_video.id' },
		'video_start_ts': { type: 'string' },
		'time_series_id': { type: 'integer' }
	}).then((info) => {
		console.log('channel_timeslot table created')
	}).catch((err) => {
		console.log(err);
	});

	await db.createTable('topic', {
		'channel_id': { type: 'unsigned_integer',  isForeign: true, foreignKey: 'channel.id' },
		'name': { type: 'string' }
	}).then((info) => {
		console.log('topic table created')
	}).catch((err) => {
		console.log(err);
	});;	

	console.log("All tables successfully created");
	cb();
}

var args = process.argv.slice(2);
if (args.length == 1 && args[0] === '--drop') {
	db.dropAllTables()
		.then(() => { 
			console.log('Successfully dropped tables');
			createTables(() => process.exit(0));
		})
		.catch((err) => {
			console.log(err);
			process.exit(0);
		});
} else {
	createTables(() => process.exit(0));
}



