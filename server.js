const express = require("express");
const path = require("path");
const app = express();
const port = process.argv[2] || process.env.PORT || 5000;

const PokeAPI = require("pokedex-promise-v2");
const Pokedex = new PokeAPI();

// Static file declaration
app.use(express.static(path.join(__dirname, "build")));

// Create a GET route
app.get("/express_backend", (req, res) => {
  res.send({express: "Your Express backend is connected to React"});
});

// API call for getting a pokemon by name
app.get("/getPokemon/:name", (req, res) => {
  var name = req.params.name;
  var result = Pokedex.getPokemonByName(name)
    .then(function(response) {
      console.log(`GET /getPokemon/${name}`);
      res.send(response);
    })
    .catch(function() {
      res.send(null);
      console.log(`ERROR AT: GET /getPokemon/${name}`);
      console.log(`\t Name: ${name}`);
    });
});

app.get("/getSpecies/:name", (req, res) => {
  var name = req.params.name;
  var result = Pokedex.getPokemonSpeciesByName(name)
    .then(function(response) {
      console.log(`GET /getSpecies/${name}`);
      res.send(response);
    })
    .catch(function() {
      res.send(null);
      console.log(`ERROR AT: GET /getSpecies/${name}`);
      console.log(`\t Name: ${name}`);
    });
});

app.get("/getAbility/:name", (req, res) => {
  var name = req.params.name;
  var result = Pokedex.getAbilityByName(name)
    .then(function(response) {
      console.log(`GET /getAbility/${name}`);
      res.send(response);
    })
    .catch(function(response) {
      res.send(null);
      console.log(`ERROR AT: GET /getAbility/${name}`);
      console.log(`\t Name: ${name}`);
    });
});

app.get("/getEvolution/:id", (req, res) => {
  var id = req.params.id;
  var result = Pokedex.getEvolutionChainById(id)
    .then(response => {
      console.log(`GET /getEvolution/${id}`);
      res.send(response);
    })
    .catch(response => {
      res.send(null);
      console.log(`ERROR AT: GET /getEvolution/${id}`);
      console.log(`\t Id: ${id}`);
    });
});

app.get("/getResource/:url", (req, res) => {
  var url = req.params.url;

  var result = Pokedex.resource(url)
    .then(response => {
      console.log(`GET /getResource/${decodeURIComponent(url)}`);
      res.send(response);
    })
    .catch(response => {
      res.send(null);
      console.log(`ERROR AT: GET /getResource/${url}`);
      console.log(`\t Url: ${url}`);
    });
});

app.get("/getType/:name", (req, res) => {
  var name = req.params.name;
  var result = Pokedex.getTypeByName(name)
    .then(function(response) {
      console.log(`GET /getType/${name}`);
      res.send(response);
    })
    .catch(function(response) {
      res.send(null);
      console.log(`ERROR AT: GET /getType/${name}`);
      console.log(`\t Name: ${name}`);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
