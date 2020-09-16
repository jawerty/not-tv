<template>
  <div class="login">
    <b-form @submit="onSubmit">
      <b-text v-if="errorMessage" class="error-message mb-2 d-block">* {{ errorMessage }}</b-text>
      <b-form-group
          id="input-group-1"
          label="Username:"
          label-for="input-1"
        >
        <b-form-input
          id="input-1"
          v-model="form.username"
          required
          placeholder="Enter username"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          required
          type="password"
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>

      <div class="d-flex align-items-center">
        <b-button type="submit" variant="primary" class="mr-2">Login</b-button>
        <img src="/images/spinner.gif" v-if="loading" class="loading-icon d-inline"/>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  props: {
  },
  data() {
    return {
      form: {
        username: null,
        password: null
      },
      loading: false,
      errorMessage: null
    }
  },
  methods: {
    onSubmit() {
      e.preventDefault();
      this.loading = true;

      this.errorMessage = null;
      axios({
        method: 'post',
        url: '/api/login',
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
</style>
