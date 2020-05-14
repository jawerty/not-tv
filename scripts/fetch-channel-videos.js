process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const fs = require('fs');

const moment = require('moment');
const puppeteer = require('puppeteer');

const DB = require('../lib/db');
const CookieStore = require('../lib/cookie-store');
const TopicModel = require('../lib/topic-model');
const VideoFetcher = require('../lib/video-fetcher');
const VideoRater = require('../lib/video-rater');

let db, videoRater, videoFetcher, cookieStore;

(async () => {
	db = new DB();
	cookieStore = new CookieStore();
	videoRater = new VideoRater();
	videoFetcher = await new VideoFetcher();

	const args = process.argv.slice(2);
	if (args.length >= 1) {
		if (args.indexOf('--cookie-reset') > -1) {
			await cookieStore.generateCookies();
		}
		fetchChannelVideos(args[0], () => {
			process.exit(0);
		});	
	} else {
		console.log("Argument error: fetch-channel-videos.js <channelId>");
	}
})();

async function fetchChannelVideos(channelId, cb) {
	db.setTable('channel');
	let channel = await db.getRows({ id: channelId });
	channel = channel[0];

	console.log(`-- Getting videos for ${channel.name}#${channel.id} --`)
	const topics = await getTopicsForChannel(channel.id);
	const topicModel = new TopicModel(topics);
	const searchTerms = topicModel.createSearchTerms();

	const channelVideos = await getChannelVideos(searchTerms);
	console.log("-- Video info successfully scraped --");
	const distinctUrls = [];
	const filteredChannelVideos = channelVideos.filter((channelVideo, i) => {
		if (distinctUrls.indexOf(channelVideo.url) == -1) {
			distinctUrls.push(channelVideo.url);
			return true;
		} else if (!channelVideo) {
			return false;
		}
		return false;
	}).map((channelVideo) => {
		videoRater.setVideoInfo(channelVideo);
		if (channelVideo.viewCount && channelVideo.likes && channelVideo.dislikes) {
			channelVideo.rating = videoRater.rateVideo(); 
			return channelVideo;
		}
	});
	console.log("-- Videos rated and filtered --");

	await saveChannelVideos(channel.id, filteredChannelVideos);
	console.log(`-- Videos saved for ${channel.name}#${channel.id} --`);

	cb();
}


function getTopicsForChannel(channelId) {
	db.setTable('topic');
	return db.getRows({ channel_id: channelId })
}

function getChannelVideos(searchTerms) {
	return new Promise(async (resolve, reject) => {
		videoFetcher.setSearchTerms(searchTerms);
		let youtubeLinks = await videoFetcher.getYoutubeLinks(1);
		console.log("-- Video links successfully gathered --");

		const chunkedYoutubeLinks = chunkArray(youtubeLinks, 10);

		let channelVideos = [];
		let youtubeLinksChunk;
		for (let i = 0; i < chunkedYoutubeLinks.length; i++) {
			console.log("Chunk", i+1, "/", chunkedYoutubeLinks.length);
			youtubeLinksChunk = chunkedYoutubeLinks[i];

			youtubeLinksChunk = youtubeLinksChunk.map((linkInfo) => {
				return videoFetcher.getYoutubeVideoInfo(linkInfo);
			});
			async function runYoutubeChunks() {
				return new Promise((resolve, reject) => {
					Promise.all(youtubeLinksChunk).then((channelVideos) => {
						resolve(channelVideos);
					}).catch((err) => {
						console.log(err)
						resolve([]);
					});
				});
			}
			const channelVideosChunk = await runYoutubeChunks();
			channelVideos = channelVideos.concat(channelVideosChunk);
		}
		console.log("-- Finished Running Chunks --");
		resolve(channelVideos);
	});
}

function saveChannelVideos(channelId, channelVideos) {
	db.setTable('channel_video');
	return new Promise((resolve, reject) => {
		const insertPromises = [];
		channelVideos.forEach((channelVideo) => {
			if (channelVideo) {
				insertPromises.push(db.insertRow({
					'channel_id': channelId,
					'title': channelVideo.watchTitle,
					'creator_name': channelVideo.creatorName,
					'creator_url': channelVideo.creatorLink,
					'video_url': channelVideo.url,
					'duration': channelVideo.duration,
					'rating': channelVideo.rating
				}).catch((err) => {
					console.log("Insert error", err);
				}));
			};
		});
		Promise.all(insertPromises).then((rowIds) => {
			console.log(`-- Inserted ${rowIds.length} rows into channel_video --`);
			resolve();
		})
		.catch((err) => {
			reject("Save error:", err);
		});
	});
}

function chunkArray(array, chunks) {
	let i, j, tempArray;
	const chunk = chunks;
	const newArray = [];
	for (i=0,j=array.length; i<j; i+=chunk) {
	    tempArray = array.slice(i,i+chunk);
	    newArray.push(tempArray);
	}
	return newArray;
}

