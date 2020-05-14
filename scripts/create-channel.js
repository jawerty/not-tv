const DB = require('../lib/db');
const Channel = require('../lib/channel');

const db = new DB();

async function createChannel(name, topics, cb) {
	db.setTable('channel');
	const channelInfo = await db.insertRow({ name });
	const channelId = channelInfo[0];

	db.setTable('topic');
	for (let i = 0; i < topics.length; i++) {
		const topic = topics[i];
		const topicInfo = await db.insertRow({ name: topic, channel_id: channelId });
		const topicId = topicInfo[0];
		console.log(`Topic '${topic}'#${topicId} created`);		
	};

	cb(channelId);
}

if (require.main === module) {
	const args = process.argv.slice(2);
	if (args.length == 2) {
		createChannel(args[0], args[1].split(','), (channelId) => {
			console.log(`Channel '${args[0]}'#${channelId} created`);
			process.exit(0);
		});	
	} else {
		console.log("Argument error: create-channel.js <name> <topics>");
	}
} else {
	module.exports = createChannel;
}
// node create-channel.js "UFC" "Conor Mcgregor,ufc,mma,dana white,bjj,sparring,muay thai,train,strong"

