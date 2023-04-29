const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')


// Route to get total number of recovered patients
app.get('/totalRecovered', async (req, res) => {
    const totalRecovered = await connection.aggregate([
      {$group: {_id: "total",recovered: { $sum: "$recovered" } } }
    ]).toArray();
    res.json({ data: totalRecovered[0] });
  });
  
  // Route to get total number of active patients
  app.get('/totalActive', async (req, res) => {
    const totalActive = await connection.aggregate([
      {$group: { _id: "total", active: { $sum: { $subtract: ["$infected", "$recovered"] } } } }
    ]).toArray();
    res.json({ data: totalActive[0] });
  });
  
  // Route to get total number of deaths
  app.get('/totalDeath', async (req, res) => {
    const totalDeath = await connection.aggregate([
      {$group: {_id: "total",death: { $sum: "$death" }} }
    ]).toArray();
    res.json({ data: totalDeath[0] });
  });
  
  // Route to get hotspot states
  app.get('/hotspotStates', async (req, res) => {
    const hotspotStates = await connection.aggregate([
      {$project: {_id: 0,state: 1,rate: {$round: [{$divide: [{ $subtract: ["$infected", "$recovered"] },"$infected" ]}, 5 ]} } },
      {$match: {rate: { $gt: 0.1 }}},
      {$sort: {rate: -1}}
    ]).toArray();
    res.json({ data: hotspotStates });
  });
  
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;