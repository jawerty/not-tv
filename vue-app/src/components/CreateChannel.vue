<template>
  <div class='create-channel'>
    <b-form @submit="onSubmit">
      <b-text v-if="errorMessage" class="error-message mb-2 d-block">* {{ errorMessage }}</b-text>
      <b-form-group
        label="Channel Name:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter channel name"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Tags:"
        label-for="input-2"
      >
        <b-form-tags required v-model="form.tags"></b-form-tags>
      </b-form-group>
      <div class="d-flex align-items-center">
        <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
        <img src="/images/spinner.gif" v-if="loading" class="loading-icon d-inline"/>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreateChannel',
  props: {
  },
  data() {
    return {
      form: {
        name: "",
        tags: []
      },
      errorMessage: null,
      loading: false
    }
  },
  methods: {
    onSubmit(e) {      
      e.preventDefault();

      this.errorMessage = null;
      this.loading = true;
      axios({
        method: 'post',
        url: '/api/create-channel',
        data: this.form
      }).then((data) => {
        console.log(data);
        this.loading = false;
      }).catch((err) => { 
        this.loading = false;
        const errorMessage = err.response.data.errorMessage;
        if (errorMessage) {
          this.errorMessage = errorMessage
        }
      });
    }
  }
}
</script>

<style scoped>
.error-message {
  color: #F03C02;
}

.loading-icon {
  width: 38px;;
}
</style>
