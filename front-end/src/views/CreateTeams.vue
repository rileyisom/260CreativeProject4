<template>
    <div v-if="user">
      <h2>Make a Team</h2>
      <div class="form">
        <p>Team Name:</p><input type="text" v-model="teamName">
        <br>
        <br>
        <p>Team Color:</p><swatches-picker v-model="color"/>
        <p>Team Specialty:</p><input type="text" v-model="teamSpecialty">
        <br>
        <br>
        <PokemonList teamMode="createTeam" @addToTeam="pokemons.push($event._id)"/>
        <br>
        <br>
        <button @click="addTeam">Create Team</button>
      </div>
    </div>

    <Login v-else />
</template>

<script>
import PokemonList from "../components/PokemonList.vue"
import Login from "../components/Login.vue"
import axios from 'axios';
import { Swatches } from 'vue-color'
export default {
  name: 'Home',
  components: {
    'swatches-picker': Swatches,
    PokemonList,
    Login
  },
  data() {
    return {
      teams: [],
      team: null,
      teamName: '',
      color: "#000",
      teamSpecialty: '',
      teamVictory: '',

      pokemons: [],
      pokemon: null,
      pokemonID: null,
      pokemonName: '',
      pokemonType: '',
      pokemonImage: '',
      pokemonMove1: '',
      pokemonMove2: '',
      show: 'all',
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
    this.getTeams();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    madePokemons() {
      return this.pokemons;
    },
  },
  methods: {
    fileChanged(event) {
        this.file = event.target.files[0];
    },
    async addTeam() {
      try {
        await axios.post("/api/teams", {
          name: this.teamName,
          color: this.color.hex,
          specialty: this.teamSpecialty,
          victory: this.teamVictory,
          pokemons: this.pokemons,
          user: this.$root.$data.user._id,
        });
        await this.getTeams();
      } catch (error) {
        console.log(error);
      }
    },
    async getTeams() {
      try {
        const response = await axios.get("/api/teams");
        this.teams = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    selectTeam(team) {
      this.team = team;
      this.getPokemons();
    },
    active(team) {
      return (this.team && team._id === this.team._id);
    },
    darkColor(color) {
      return (this.lightOrDark(color) === 'dark');
    },
    lightOrDark(color) {
      let hex = color;
      if (typeof color === 'object' && color !== null)
        hex = color.hex;

    // Convert it to RGB: http://gist.github.com/983661
      let rgb = +("0x" + hex.slice(1).replace( 
      hex.length < 5 && /./g, '$&$&'));

      const r = rgb >> 16;
      const g = rgb >> 8 & 255;
      const b = rgb & 255;
      
      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      const hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
      );

      // Using the HSP value, determine whether the color is light or dark
      if (hsp>127.5) {

          return 'light';
      } 
      else {

          return 'dark';
      }
    }
  }
}
</script>

<style scoped>
/* List */
ul {
  list-style: none;
}

li {
  background: #fff;
  width: 500px;
  min-height: 40px;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1em;
  display: flex;
  align-items: center;
}

p {
    margin: 5px;
}

.delete {
  display: none;
  margin-left: auto;
}

li:hover .delete {
  display: block;
}

label {
  width: 400px;
}

.completed {
  text-decoration: line-through;
}

/* Form */
input[type=checkbox] {
  transform: scale(1.5);
  margin-right: 10px;
}

input[type=text] {
  font-size: 1em;
}

.vc-swatches {
  margin: 20px auto;
}

.vc-swatches-box {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-bottom: 20px;
}

.vc-swatches-box {
    align-content: center;
}

#projects {
  margin: 20px;
}



button {
  font-family: 'Arvo';
  font-size: 1em;
  border: none;
  background-color: #bbb;
  padding: 5px 10px;
}

button:focus {
  outline: none;
}

button.selected {
  border-bottom: 2px solid #000;
}

.white {
  color: #fff;
}

/* Controls */
.controls {
  margin-top: 20px;
}

/* Custom checkbox
/* Customize the label (the container) */
.item {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.item input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.item:hover input~.checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.item input:checked~.checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
</style>
