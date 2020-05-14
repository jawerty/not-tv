class Channel {
	constructor(name, topics) {
		this.name = name;
		this.topcs = topics;
	}

	getName() {
		return this.name;
	}

	getTopics() {
		return this.topics;
	}
}

module.exports = Channel;