<template>
  <div id="app" >
    <div id="nav" v-if="user">
      <router-link to="/">Pokemon</router-link> |
      <router-link to="/teams">Teams</router-link> |
      <router-link to="/createPokemon">Create Pokemon</router-link> |
      <router-link to="/createTeams">Create Teams</router-link> 
      <p></p>
      <button @click="logout">Log Out</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
