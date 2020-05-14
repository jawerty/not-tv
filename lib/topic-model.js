const natural = require('natural');

class TopicModel {
	constructor(topics) {
		this.topics = topics;
		this.topicNames = topics.map((topic) => topic.name);

		const language = "EN"
		const defaultCategory = 'N';
		const defaultCategoryCapitalized = 'NNP';

		const lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
		const ruleSet = new natural.RuleSet('EN');
		this.tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
	}

	filterTopics() {		
		// remove topics that cannot be used
	}

	createSearchTerms() {
		const topicTags = this.getTopicTags();
		const searchTerms = [];

		topicTags.properNouns.forEach((topicNNP, index) => {
			searchTerms.push(topicNNP);

			topicTags.regularNouns.forEach((topicN) => {
				searchTerms.push(`${topicNNP} ${topicN}`)
			});

			topicTags.adjectives.forEach((topicJJ) => {
				searchTerms.push(`${topicJJ} ${topicNNP}`)
			});

			topicTags.verbs.forEach((topicVB) => {
				searchTerms.push(`${topicNNP} ${topicVB}`)
			});

			const properNounsRest = topicTags.properNouns.slice(index + 1);
			properNounsRest.forEach((otherNNP) => {
				searchTerms.push(`${topicNNP} ${otherNNP}`)
			});
		});

		topicTags.regularNouns.forEach((topicN, index) => {
			if (!topicTags.properNouns) { // unnecessary if proper nouns available
				searchTerms.push(topicN);
			};

			topicTags.verbs.forEach((topicVB) => {
				searchTerms.push(`${topicN} ${topicVB}`)
			});

			topicTags.adjectives.forEach((topicJJ) => {
				searchTerms.push(`${topicJJ} ${topicN}`)
			});

			const regularNounsRest = topicTags.regularNouns.slice(index + 1);
			regularNounsRest.forEach((otherN) => {
				searchTerms.push(`${topicN} ${otherN}`)
			});
		});

		return searchTerms;
	}

	getTopicTags() {
		// get array of logical combinations of topics
		const topicPOS = this.tagger.tag(this.topicNames);

		const topicTags = {}
		topicTags.properNouns = [];
		topicTags.regularNouns = [];
		topicTags.verbs = [];
		topicTags.adjectives = [];
		topicTags.other = [];

		topicPOS.taggedWords.forEach((tagInfo) => {
			const tag = tagInfo.tag;
			const token = tagInfo.token;
			if (tag.startsWith('NNP')) {
				topicTags.properNouns.push(token);
			} else if (tag.startsWith('N')) {
				topicTags.regularNouns.push(token);
			} else if (tag.startsWith('VB')) {
				topicTags.verbs.push(token);
			} else if (tag.startsWith('JJ')) {
				topicTags.adjectives.push(token);
			} else {
				topicTags.other.push(token);
			}
		});

		return topicTags;
	}
}

module.exports = TopicModel;