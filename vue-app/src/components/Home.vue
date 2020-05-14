<template>
  <div class="home">
    <Header />
    <div class="content">
      <ChannelList :channels="channels" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './Header';
import Footer from './Footer';
import ChannelList from './ChannelList';
// import CreateChannel from './CreateChannel';
// import TopChannel from './TopChannel';

export default {
  components: { Header, Footer, ChannelList },
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
</style>
