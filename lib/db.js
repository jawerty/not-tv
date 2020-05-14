require('dotenv').load();

const knex = require('knex');

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
		  pool: { min: 0, max: 7 }
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
		const miliseconds = 1000;
		const currentTs =(new Date()).getTime() * miliseconds;
		return this.knex.select('channel.name', 'channel_video.title', 'channel_video.video_url')
		  	.from('channel_timeslot')
		  	.where({'channel_timeslot.channel_id': channelId})
		  	.andWhere('channel_timeslot.video_start_ts', '<', currentTs)
		  	.max('channel_timeslot.video_start_ts')
		  	.leftJoin('channel_video', 'channel_video.id', 'channel_timeslot.channel_video_id')
		  	.leftJoin('channel', 'channel.id', 'channel_timeslot.channel_id')

	}
}

module.exports = DB;