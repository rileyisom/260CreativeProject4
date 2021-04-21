<template>
<div class="wrapper">
  <div class="teams">
    <div class="team" v-for="(team) in teams" :key="team.name">
        <div class="info" :style="{ 'background-color': team.color }">
          <h1>{{team.name}}</h1>
          <h2>{{team.specialty}}</h2>
          <h2>Victory: {{getVictory()}}</h2>
          <h4>Made by {{team.user.username}}</h4>
        </div>
        <PokemonList :filteredList="team.pokemons" teamMode="viewTeam"/>
        <button class="auto" @click="deleteTeam(team)">Remove</button>
    </div>
  </div>
</div>
</template>

<script>
import PokemonList from "../components/PokemonList.vue"
import axios from 'axios';
export default {
    name: 'TeamList',
    components: {
        PokemonList
    },
    data() {
      return {teams: []};
    },
    created() {
      this.getTeams();
    },

    methods: {
      async getTeams() {
        try {
          let response = await axios.get("/api/teams");
          this.teams = response.data;
          return true;
        } catch (error) {
          console.log(error);
        }
      },
      async deleteTeam(team) {
        try {
          await axios.delete(`/api/teams/${team._id}`);
          this.getTeams();
        } catch (error) {
          console.log(error);
        }
      },
      getVictory() {
          let num = Math.random();
          if(num > 0.5) return 'true';
          else return 'false';
      },
    }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.teams {
  width: 90%;
  margin-top: 20px;
  border: 3px;
  border-style: solid;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.team {
  width: 80%;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 3px;
  border-style: solid;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  border-style: solid;
  border-width: 2px;
}

.pokemons {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.pokemon {
  border: 2px solid #333;
  border-radius: 5px;
  margin: 10px;
  margin-top: 30px;
  width: 300px;
}

.pokemon img {
  height: 250px;
  width: 300px;
  object-fit: cover;
}

.pokemon .image {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}

.info h1 {
  font-size: 16px;
  color: white;
}

.info h2 {
  font-size: 14px;
  color: white;
}

.info h4 {
  font-size: 14px;
  color: white;
}

button {
  height: 50px;
  width: 100%;
  background: #000;
  color: white;
  border: none;
}

.auto {
  margin-left: auto;
}
</style>