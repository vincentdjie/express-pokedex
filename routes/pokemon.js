var express = require('express');
var router = express.Router(); //router instead of app
var db = require('../models'); //now is in route dir, go into parent dir, go into models dir
var axios = require('axios');

// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  // TODO: Get all records from the DB and render to view
  // call db.pokemon.findAll
  // get data and render into an ejs
  db.pokemon.findAll().then(function(poke) {
    console.log('Found: ', poke.name)
    res.render('favorites', {pokemon: poke}); //replace this w res.render; pokemon is object used in index.ejs
  })
});

// POST /
// pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) { // '/pokemon/'   ; separates routes out of main file
  // TODO: Get form data and add a new record to DB
  // cal db.pokemon.create and pass in the data from the form
  // when the promise returns, we need to redirect to /pokemon
    db.pokemon.create({
      name: req.body.name
    }).then(function(poke) {
      console.log('Created: ', poke.name)
      res.redirect('/pokemon');
    })
});

//GET /pokemon/:id - gets 1 poke id from dtbase & use it to look up DETAILS of the one pokemon
router.get('/:id', function (req, res) {
  //look up pokemon in our db by its ID (findByPk) primary key is Pk
  // user the pokemon name from the db to query the api for details on that 1 pokemon
  // take data from the api & render a detail/show page for this 1 pokemon
  db.pokemon.findByPk(parseInt(req.params.id)).then(function(poke) {
    axios.get('http://pokeapi.co/api/v2/pokemon/' + poke.name +'/')
      .then (function(apiResponse) {
        res.render('show', {pokemon : apiResponse.data});
      });
  });
});

//DELETE
router.delete('/:id', function(req, res) {
  db.pokemon.destroy({
    where: {id: parseInt(req.params.id)}
    }).then(function(pokemon) {
    res.redirect('/pokemon');
  })
});


module.exports = router;
