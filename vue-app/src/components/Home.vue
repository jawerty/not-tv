<template>
  <div class="home">
    <div class="content p-3">
      <ChannelList :channels="channels" />
    </div>
  </div>
</template>

<script>
import ChannelList from './ChannelList';
// import CreateChannel from './CreateChannel';
// import TopChannel from './TopChannel';

export default {
  components: { ChannelList },
  name: 'Home',
  props: {
  },
  data() {
    return {
      channels: window.channels
    }
  }
}
</script>

<style scoped>
.content {
}
</style>
