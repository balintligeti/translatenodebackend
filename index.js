const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'Ligeti',
  host: 'localhost',
  database: 'english_database',
  password: '1',
  port: 5432,
});

const getDictionaries = () => {
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM dictionary ORDER BY id ASC', (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const addWord = (body) => {
  console.log(body)
    return new Promise(function(resolve, reject) {
      const { foreign, en } = body;
      pool.query('INSERT INTO dictionary ("foreignWord", "engWord") VALUES ($1, $2) RETURNING *', [foreign, en], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`A new word has been added added: ${results.rows[0]}`)
      })
    })
  };
  const deleteWord = (id) => {
		console.log(id);

    return new Promise(function(resolve, reject) {
      //const id = parseInt(request.params.id);
      pool.query('DELETE FROM dictionary WHERE id = $1', [id], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Dictionary deleted with ID: ${id}`)
      })
    })
  };
  
  module.exports = {
    getDictionaries,
    addWord,
    deleteWord,
  }
  
  
  
  const express = require('express');
  const app = express();
  const port = 3001;
  
  const dictionary_model = require('./dictionary_model');
  
  app.use(express.json())
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
  });
  
  app.get('/', (req, res) => {
    getDictionaries()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })
  
  app.post('/dictionaries', (req, res) => {
    addWord(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })
  
  app.delete('/dictionaries/:id', (req, res) => {
    deleteWord(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
