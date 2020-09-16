<template>
  <div class="channel-card">
    <router-link
      class="router-link"
      :to="{ 
        name: 'WatchChannel', 
        params: { channelId }
      }"
    >
      <b-card
        :title="`#${channelName}`"
        tag="article"
        class="mb-2"
      >
        <VideoPlayer :videoUrl="videoUrl" class="mb-2 video-player-thumbnail" :thumbnail="true"/>
        <b-card-text>
          <span class="current-video-name">Now playing</span> "{{ currentVideoName }}"
        </b-card-text>
        <WatcherCount :count="watcherCount" />
        <TagList :tags="tags" />
      </b-card>
    </router-link>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer';
import WatcherCount from './WatcherCount';
import TagList from './TagList';

export default {
  components: { VideoPlayer, WatcherCount, TagList },
  name: 'ChannelCard',
  props: {
    channelName: {
      type: String,
      required: true
    },
    channelId: {
      type: Number,
      required: true
    },
    currentVideoName: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    watcherCount: {
      type: Number,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    key: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      imageNum: Math.floor(Math.random() * 100) + 1
    }
  }
}
</script>

<style scoped>
.channel-card {
  width: 18rem;
}

.current-video-name {
  color: #007bff;
}

.router-link {
  text-decoration: initial;
  color: initial;
}

.video-player-thumbnail {
  width: 100%;
  height: 160px;
}
</style>
