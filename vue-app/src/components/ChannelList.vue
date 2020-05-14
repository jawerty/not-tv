<template>
  <div class="channel-list">
    <ChannelCard 
      v-for="channel in channels"
      :name="channel.name"
      :currentVideoName="channel.currentVideo"
      :tags="channel.tags"
      :watcherCount="Math.floor(Math.random() * 20000) + 1"
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
    }
  }
}
</script>

<style scoped>
.channel-list {
}
</style>
