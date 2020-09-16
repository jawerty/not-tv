<template>
  <div class="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';
export default {
  components: { Header, Footer },
  name: 'App'
}
</script>

<style scoped>
</style>
