const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

// Configure multer so that it will upload to '../front-end/public/images'
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// connect to the database
mongoose.connect('mongodb://localhost:27017/todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Schema for pokemons
const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String,
    type: String,
    image: String,
    move1: String,
    move2: String,
});

// Model for pokemons
const Pokemon = mongoose.model('Pokemon',pokemonSchema);

// Create a scheme for teams
const teamSchema = new mongoose.Schema({
    name: String,
    color: String,
    specialty: String,
    victory: String,
    pokemons: [mongoose.Schema.ObjectId]
});
  
// Create a model for teams
const Team = mongoose.model('Team', teamSchema);


// Create a team
app.post('/api/teams', async (req, res) => {
    const team = new Team({
        name: req.body.name,
        color: req.body.color,
        specialty: req.body.specialty,
        victory: req.body.victory,
        pokemons: req.body.pokemons,
    });
    try {
        await team.save();
        res.send(team);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Get a list of all teams
app.get('/api/teams', async (req, res) => {
    try {
      let teams = await Team.find().lean();
      for(let i = 0; i < teams.length; i++) {
        let team = teams[i];
        let newPokemons = [];
        for(let j = 0; j < team.pokemons.length; j++) {
            let testPokemon = await Pokemon.findOne({_id:team.pokemons[j]}).lean();
            newPokemons.push(testPokemon);
        } 
        team.pokemons = newPokemons;
      }
      res.send(teams);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Get a list of all pokemons
app.get('/api/pokemons', async (req, res) => {
    try {
      let pokemons = await Pokemon.find();
      res.send(pokemons);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Create a pokemon
app.post('/api/pokemons', async (req, res) => {
    let pokemon = new Pokemon({
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        image: req.body.image,
        move1: req.body.move1,
        move2: req.body.move2,
    });
    try {
        await pokemon.save();
        res.send(pokemon);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/teams/:teamID/pokemons', async (req, res) => {
    try {
        let team = await Team.findOne({_id: req.params.teamID});
        if (!team) {
            res.send(404);
            return;
        }
        let pokemons = await Pokemon.find({team:team});
        res.send(pokemons);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// get a single pokemon
app.get('/api/pokemons/:pokemonID', async (req, res) => {
    try {
      let pokemon = await Pokemon.findOne({_id:req.params.pokemonID});
      if(!pokemon) {
        res.send(404);
        return;
      }
      res.send(pokemon);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

app.get('/api/teams/:teamID/pokemons', async (req, res) => {
    try {
        let team = await Team.findOne({_id: req.params.teamID});
        if (!team) {
            res.send(404);
            return;
        }
        let pokemons = await Pokemon.find({team:team});
        res.send(pokemons);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/teams/:teamID/pokemons/:pokemonID', async (req, res) => {
    try {
        let pokemon = await Pokemon.findOne({_id:req.params.pokemonID, team: req.params.teamID});
        if (!pokemon) {
            res.send(404);
            return;
        }
        pokemon.id = req.body.id;
        pokemon.name = req.body.name;
        pokemon.type = req.body.type;
        pokemon.image = req.body.image;
        pokemon.move1 = req.body.move1;
        pokemon.move2 = req.body.move2;
        await pokemon.save();
        res.send(pokemon);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/teams/:teamID', async (req, res) => {
    try {
        let team = await Team.findOne({_id:req.params.teamID});
        if (!team) {
            res.send(404);
            return;
        }
        await team.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/pokemons/:pokemonID', async (req, res) => {
    try {
      let pokemon = await Pokemon.findOne({_id:req.params.pokemonID});
      if(!pokemon) {
        res.send(404);
        return;
      }
      await pokemon.delete();
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    // Just a safety check
    if (!req.file) {
      return res.sendStatus(400);
    }
    res.send({
      path: "/images/" + req.file.filename
    });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));