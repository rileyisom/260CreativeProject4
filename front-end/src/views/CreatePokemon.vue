<template>
<div v-if="user">
  <h2>Make a Pokemon</h2>
  <div class="form">
        <p>Pokemon ID:</p><input type="text" v-model="pokemonID">
        <br>
        <br>
        <p>Pokemon Name:</p><input type="text" v-model="pokemonName">
        <br>
        <br>
        <p>Pokemon Type:</p><select v-model="pokemonType">
          <option value="Grass">Grass</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Electric">Electric</option>
          <option value="Ice">Ice</option>
          <option value="Fighting">Fighting</option>
          <option value="Poison">Poison</option>
          <option value="Ground">Ground</option>
          <option value="Psychic">Psychic</option>
          <option value="Bug">Bug</option>
          <option value="Rock">Rock</option>
          <option value="Ghost">Ghost</option>
          <option value="Flying">Flying</option>
          <option value="Dark">Dark</option>
          <option value="Steel">Steel</option>
          <option value="Dragon">Dragon</option>
          <option value="Fairy">Fairy</option>
          <option value="Normal">Normal</option>
          <option value="Other">Other</option>
        </select>
        <br>
        <br>
        <p>Pokemon Image:</p><input type="file" name="pokemonImage" @change="fileChanged">
        <br>
        <br>
        <p>Pokemon Move 1:</p><input type="text" v-model="pokemonMove1">
        <br>
        <br>
        <p>Pokemon Move 2:</p><input type="text" v-model="pokemonMove2">
        <br>
        <br>
        <button @click="addPokemon">Upload</button>
  </div>
  <PokemonList/>
</div>

<Login v-else />
</template>



<script>
import Login from "../components/Login.vue"
import axios from 'axios';
export default {
  name: 'Home',
  components: {
    Login
  },
  data() {
    return {
      teams: [],
      team: null,
      teamName: '',
      color: "#000",
      teamSpecialty: '',
      teamVictory: null,

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
    this.getPokemons();
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
  
    async addPokemon() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        await axios.post(`/api/pokemons`, {
          id: this.pokemonID,
          name: this.pokemonName,
          type: this.pokemonType,
          image: r1.data.path,
          move1: this.pokemonMove1,
          move2: this.pokemonMove2,
          user: this.$root.$data.user._id,
        });

        this.pokemonID = 0;
        this.pokemonName = "";
        this.pokemonType = "";
        this.pokemonImage = "";
        this.pokemonMove1 = "";
        this.pokemonMove2 = "";
      } catch (error) {
        console.log(error);
      }
    },
    async deletePokemon(pokemon) {
      try {
        await axios.delete(`/api/teams/${this.team._id}/pokemons/${pokemon._id}`);
      } catch (error) {
        console.log(error);
      }
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
