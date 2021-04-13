import Vue from 'vue'
import VueRouter from 'vue-router'
import Pokemon from '../views/Pokemon.vue'
import Teams from '../views/Teams.vue'
import CreatePokemon from '../views/CreatePokemon.vue'
import CreateTeams from '../views/CreateTeams.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Pokemon',
    component: Pokemon
  },
  {
    path: '/teams',
    name: 'Teams',
    component: Teams
  },
  {
    path: '/createPokemon',
    name: 'CreatePokemon',
    component: CreatePokemon
  },
  {
    path: '/createTeams',
    name: 'CreateTeams',
    component: CreateTeams
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
