class ChannelProgramming {
	constructor(channelVideos) {
		this.channelVideos = channelVideos;
		this.hourRatings = { // will be dynamic in the future
			'0': 18,
			'1': 20,
			'2': 22,
			'3': 23,
			'4': 24,
			'5': 21,
			'6': 19,
			'7': 17,
			'8': 16,
			'9': 15,
			'10': 14,
			'11': 13,
			'12': 12,
			'13': 11,
			'14': 10,
			'15': 9,
			'16': 7,
			'17': 6,
			'18': 5,
			'19': 4,
			'20': 1,
			'21': 2,
			'22': 3,
			'23': 8		
		};
	}

	createTimeSlots(timebox) { // timebox is int of hours (24 for 24 hours)
		const timeslots = [];

		this.channelVideos.sort(function(a, b) { // sort by rating descending
			const ratingA = a.rating;
			const ratingB = b.rating;
			if (ratingA > ratingB) return -1;
			if (ratingA < ratingB) return 1;
			return 0;
		});
		// console.log(this.channelVideos);
		const channelVideosByHour = this.splitChannelVideoByHour();

		const timeboxInSeconds = (timebox * 60 * 60);
		let timeboxDuration = 0;
		let d = new Date();
		let hourCursor = d.getHours();

		let hourRating = this.hourRatings[hourCursor];
		let channelVideosForRating = this.shuffle(channelVideosByHour[hourRating]);

		let cursor = 0;
		console.log("TOTAL_TIME:", timeboxInSeconds)
		while (timeboxDuration < timeboxInSeconds) {
			console.log("TIME:", timeboxDuration)
			// check if current time is in new hour
			const cursorTime = new Date(d.getTime() + (1000*timeboxDuration));
			if (cursorTime.getHours() > hourCursor) {
				d = cursorTime;
				hourCursor = cursorTime.getHours();
				hourRating = this.hourRatings[hourCursor];
				channelVideosForRating = this.shuffle(channelVideosByHour[hourRating]);
				cursor = 0;
			}
			console.log("HOURS:", cursorTime.getHours());

			// add to duration and push timeslot
			if (cursor == channelVideosForRating.length-1) {
				channelVideosForRating = this.shuffle(channelVideosByHour[hourRating]);
				cursor = 0;
			};
			const channelVideo = channelVideosForRating[cursor];
			timeboxDuration += channelVideo.duration;
			channelVideo.video_start_ts = cursorTime.getTime() * 1000
			timeslots.push(channelVideo);

			cursor++;
		}

		return timeslots;
	}

	splitChannelVideoByHour() {
		const hoursInDay = 24;
		// if this.channelVideos has less that 24 videos duplicate the list until it hits 24
		if (this.channelVideos.length < hoursInDay) {
			while (this.channelVideos.length < hoursInDay) {
				this.channelVideos = this.channelVideos.concat(this.channelVideos);
			}
		}

		const channelVideoByHour = {};
		const splitCount = Math.floor(this.channelVideos.length / hoursInDay);
		const channelVideosTemp = this.channelVideos; 
		for (let i = 0; i < hoursInDay; i++) {
			const currentPlace = i*splitCount;
			if (i == hoursInDay-1) {
				// get remainder at the end
				channelVideoByHour[i+1] = this.channelVideos.slice(currentPlace);
			} else {
				channelVideoByHour[i+1] = this.channelVideos.slice(currentPlace, currentPlace+splitCount);

			}
		}

		return channelVideoByHour;
	}

	getKeyByValue(object, value) {
	  return Object.keys(object).find(key => object[key] === value);
	}

	shuffle(a) {
	    for (let i = a.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [a[i], a[j]] = [a[j], a[i]];
	    }
	    return a;
	}
}

module.exports = ChannelProgramming;