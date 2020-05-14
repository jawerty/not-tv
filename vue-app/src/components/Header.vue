<template>
  <div class="header d-flex justify-content-between align-items-center p-3">
    <div>
      <h1>not.tv</h1>
    </div>
    <div>
    <b-button variant="outline-primary">
      <b-icon-plus></b-icon-plus>
      Create Channel
    </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: 1px solid #007bff;
  }

  h1 {
    color: #007bff;
  }
</style>
