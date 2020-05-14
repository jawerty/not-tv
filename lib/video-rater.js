class VideoRater {
	setVideoInfo(videoInfo) {
		this.videoInfo = videoInfo;
	}

	rateVideo() {
		const viewCount = this.videoInfo.viewCount;
		const likes = this.videoInfo.likes;
		const dislikes = this.videoInfo.dislikes;
		return Math.log(viewCount) * likes/dislikes
	}
}

module.exports = VideoRater;