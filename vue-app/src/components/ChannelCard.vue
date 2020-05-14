<template>
  <div class="channel-card">
    <b-card
      :title="name"
      :img-src="`https://picsum.photos/600/300/?image={{imageNum}})`"
      img-alt="Image"
      img-top
      tag="article"
      class="mb-2"
    >
      <b-card-text class="">
        Now playing "{{ currentVideoName }}"
      </b-card-text>
      <b-card-text class="">
        <b-icon-circle-fill></b-icon-circle-fill>
        {{ watcherCountFormatted }}
      </b-card-text>
      <b-badge v-for="(tag, i) in tags" :key="i">{{ tag }}</b-badge>
    </b-card>
  </div>
</template>

<script>
import numeral from 'numeral';

export default {
  name: 'ChannelCard',
  props: {
    name: {
      type: String,
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
    }
  },
  data() {
    return {
      imageNum: Math.floor(Math.random() * 100) + 1,
      watcherCountFormatted: numeral(this.watcherCount).format('0a')
    }
  }
}
</script>

<style scoped>
.channel-card {
  max-width: 20rem;
}
</style>
