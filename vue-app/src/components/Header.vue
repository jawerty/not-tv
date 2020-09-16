<template>
  <div class="header d-flex justify-content-between align-items-center p-3">
    <div>
      <router-link to="/" class="router-link">
        <h1>not.tv</h1>
      </router-link>
    </div>
    <div>
      <!-- <router-link
        class="router-link"
        :to="{ 
          name: 'WatchChannel', 
          params: { channelId }
        }"
      >
      </router-link> -->
      <a
        class="header-link mr-3"
        v-b-modal.login-signup-modal>
        Login / Signup
      </a>
      <b-button 
        variant="outline-primary" 
        v-b-modal.create-channel-modal
        no-body>
        <b-icon-plus></b-icon-plus>
        Create Channel
      </b-button>
      <b-modal 
        title="Create Channel"
        id="create-channel-modal" 
        hide-footer>
        <CreateChannel />
      </b-modal>
      <b-modal 
        id="login-signup-modal" 
        hide-footer>
        <div slot="modal-title">
          <h1 class="user-modal-header text-center mb-0">
            <a :class="(showLogin) ? 'header-link-active' : 'header-link'" @click="toggleLogin">Login</a> | <a :class="(showSignup) ? 'header-link-active' : 'header-link'" @click="toggleSignup">Signup</a>
          </h1>
        </div>
        <div>
          <Login v-if="showLogin" />
          <Signup v-if="showSignup" />
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import CreateChannel from './CreateChannel';
import Login from './Login';
import Signup from './Signup';

export default {
  components: { CreateChannel, Login, Signup },
  name: 'Header',
  props: {
  },
  data() {
    return {
      showLogin: true,
      showSignup: false
    }
  },
  methods: {
    toggleLogin() {
      this.showLogin = true;
      this.showSignup = false;
    },
    toggleSignup() {
      this.showLogin = false;
      this.showSignup = true;
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: 1px solid #007bff;
  }

  .header-link {
    cursor: pointer;
    color: #007bff;
    text-decoration: initial;
  }

  .header-link-active {
    color: #363636;
    font-weight: bold;
  }

  .header-link-active:hover {
    color: #363636;
  }
  .router-link {
    text-decoration: initial;
  }

  h1 {
    color: #007bff;
  }

  .user-modal-header {
    color: #007bff;
    text-decoration: initial;
    font-size: 24px;
  }
</style>
