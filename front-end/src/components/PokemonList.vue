<template>
<div class="wrapper">
  <div class="pokemons">
    <div class="pokemon" v-for="(pokemon) in pokemons" :key="pokemon.id">
        <div class="info" :style="{ 'background-color': getColor(pokemon.type) }">
            <h1>{{pokemon.name}} {{pokemon.id}}</h1>
            <h2>{{pokemon.type}}</h2>
        </div>
        <div class="image">
            <img :src="pokemon.image">
        </div>
        <div class="moves" :style="{ 'background-color': getColor(pokemon.type) }">
            <h2> 1. {{pokemon.move1}}</h2>
            <h2> 2. {{pokemon.move2}}</h2>
            <h4> Made by {{pokemon.user.username}}</h4>
        </div>
        <div class="button" v-if="teamMode !== 'viewTeam'">
            <button class="auto" v-if="teamMode === 'viewPokemon'" @click="deletePokemon(pokemon)">Remove</button>
            <button class="auto" v-else-if="teamMode === 'createTeam'" @click="$emit('addToTeam',pokemon)">Add to Team</button>
            <button class="auto" v-else @click="doNothing()"> </button>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'PokemonList',
    data() {
      return {pokemons: []};
    },
    props: {
      teamMode: String,
      filteredList: Array,
    },
    created() {
      if(this.filteredList){
        this.pokemons = this.filteredList;
      }
      else {
        this.getPokemons();
      }
    },

    methods: {
      async getPokemons() {
        try {
          let response = await axios.get("/api/pokemons");
          this.pokemons = response.data;
          if(this.filteredList) {
            this.pokemons=this.pokemons.filter((pokemon) => {
              return (this.filteredList.find((id) => {
                return id === pokemon._id;
              }));
            });
          }
          return true;
        } catch (error) {
          console.log(error);
        }
      },
      
      async deletePokemon(pokemon) {
        try {
          await axios.delete(`/api/pokemons/${pokemon._id}`);
          this.getPokemons();
        } catch (error) {
          console.log(error);
        }
      },
        getColor(type) {
          if(type){
            let newType = type.toLowerCase();
            switch(newType) {
                case "grass":
                  return "#62E368";
                case "fire":
                  return "#FFC36F";
                case "water":
                  return "#6FD6FF";
                case "electric":
                  return "#F0F035";
                case "ice":
                  return "##22cad6";
                case "fighting":
                  return "#e03f16";
                case "ground":
                  return "#f2cf5c";
                case "psychic":
                  return "#d61ad6";
                case "rock":
                  return "#7d5015";
                case "ghost":
                  return "#5507a3";
                case "dark":
                  return "#424242";
                case "steel":
                  return "#bababa";
                case "fairy":
                  return "#ff96f5";
                case "poison":
                  return "#BB8BFF";
                case "bug":
                  return "#DDFFA6";
                case "flying":
                  return "#A6FFF5";
                case "normal":
                  return "#BEBEBE";
                case "dragon":
                  return "#3236A8"
                default:
                  return "white";
            }
          }
        },
        doNothing() {
          return;
        }
    }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
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

.info {
  background: #b3ffc7;
  color: #000;
  padding: 10px 30px;
  height: 80px;
}

.info h1 {
  font-size: 16px;
}

.info h2 {
  font-size: 14px;
}

.info p {
  margin: 0px;
  font-size: 10px;
}

.user {
  color: black;
  border: solid;
  border-color: black;
  border-width: 1px;
}

.moves {
  background: #b3ffc7;
  color: black;
}

.moves h2 {
    padding: 10px;
    margin: 0px;
}

.moves h4 {
    padding: 10px;
    margin: 0px;
}

button {
  height: 50px;
  width: 300px;
  background: #000;
  color: white;
  border: none;
}

.auto {
  margin-left: auto;
}
</style>