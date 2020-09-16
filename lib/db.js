process.env.TZ = 'America/New_York';

require('dotenv').config();

const knex = require('knex');
const moment = require('moment');

class DB {
	constructor(initialTable) {
		this.allTables = ['topic', 'channel', 'channel_video'];
		this.table = initialTable;
		this.knex = knex({
			client: 'mysql',
		  connection: {
		    host: '127.0.0.1',
		    user: process.env.SQL_USER || 'jawerty',
		    password: process.env.SQL_PASSWORD || 'localpass',
		    database: 'nottv'
		  },
		  pool: { 
		  	min: 0,
		  	max: 7
		  }
		});
	}

	setTable(table) {
		this.table = table;
	}

	insertRow(columns) {
		return this.knex(this.table)
			.returning('id')
  			.insert(columns, 'id');
	}

	getAllRows() {
		return this.knex(this.table).select('*');
	}

	getRows(where) {
		return this.knex(this.table).where(where);
	}

	getMax(where, field) {
		return this.knex(this.table).where(where).max(field);
	}

	dropAllTables() {
		return new Promise(async (resolve, reject) => {
			for (let i = 0; i < this.allTables.length; i++) {
				const table = this.allTables;
				try {
					const exists = await this.knex.schema.hasTable(table);
					if (exists) await this.knex.schema.dropTable(table);
				} catch(e) {
					console.log(e);
					reject();
				}
			}
			resolve();
		});
		
	}

	createTable(tableName, columns) {
		return this.knex.schema.createTable(tableName, (table) => {
		  table.increments('id');
		  table.timestamp('created_at').defaultTo(this.knex.fn.now());

		  Object.keys(columns).forEach(columnName => {
		  	table = this.parseNewColumn(table, columnName, columns[columnName]);
		  });
		});
	}

	parseNewColumn(table, columnName, column) {
		if (column.type == 'integer') {
			table.integer(columnName);
		} else if (column.type == 'float') {
			table.float(columnName)
		} else if (column.type == 'unsigned_integer') {
			table.integer(columnName).unsigned();
		} else if (column.type == 'string') {
			table.string(columnName);
		} else if (column.type == 'timestamp') {
			table.timestamp(columnName);
		} else if (column.type == 'timestamp_now') {
			table.timestamp(columnName).defaultTo(this.knex.fn.now());
		}

		if (column.isForeign) {
			table.foreign(columnName)
				.references(column.foreignKey);
		}

		return table;
	}

	getLiveChannels(channelId) {

		const d = new Date(new Date().toLocaleString());
		// const offsetHours = (new Date()).getTimezoneOffset() / 60;
		// d.setTime(d.getTime() - (offsetHours*60*60*1000));
		const currentTs = d.getTime();
		console.log(d);
		const currentUTCTime = moment(currentTs).format("YYYY-MM-DD HH:mm:ss");
		console.log(currentUTCTime);

		return this.knex.select('channel.name', 'channel_video.title', 'channel_video.video_url', 'channel_timeslot.video_start_ts', 'channel_video.channel_id', 'channel_video.id')
		  	.from('channel_timeslot')
		  	.where({'channel_timeslot.channel_id': channelId})
		  	.andWhere('channel_timeslot.video_start_ts', '<=', this.knex.raw('now()'))
		  	.leftJoin('channel_video', 'channel_video.id', 'channel_timeslot.channel_video_id')
		  	.leftJoin('channel', 'channel.id', 'channel_timeslot.channel_id')
		  	.orderBy('channel_timeslot.video_start_ts', 'desc')
		  	.limit(1)

	}

	getChannelById(channelId) {
		return this.knex.select('*')
			.from('channel')
			.where({ 'channel.id': channelId })
	}

	getChannelByName(channelName) {
		return this.knex.select('*')
			.from('channel')
			.where({ 'channel.name': channelName })
	}

	removeById(id) {
		return this.knex(this.table)
			.where('id', id)
  			.del()
	}

	removeByChannelId(channelId) {
		return this.knex(this.table)
			.where('channel_id', channelId)
  			.del()
	}
}

module.exports = DB;