<template>
  <div class="channel-list d-flex flex-wrap justify-content-center">
    <ChannelCard 
      v-for="(channel, i) in channelsArray"
      :channelName="channel.name"
      :currentVideoName="channel.currentVideoName"
      :tags="channel.tags"
      :videoUrl="channel.video_url"
      :channelId="channel.channelId"
      :watcherCount="Math.floor(Math.random() * 20000) + 1"
      :key="i"
      class="mr-3"
    />
  </div>
</template>

<script>
import ChannelCard from './ChannelCard';

export default {
  components: { ChannelCard },
  name: 'ChannelList',
  props: {
    channels: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      channelsArray: Object.values(this.channels)
    }
  }
}
</script>

<style scoped>
.channel-list {
}
</style>
