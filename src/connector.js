
//const mongodb = require('mongodb');

const mongoURI = "mongodb://localhost:27017" + "/covidtally"

let mongoose = require('mongoose');
const { tallySchema } = require('./schema')


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });
collection_connection = mongoose.model('covidtally', tallySchema)


exports.connection = collection_connection;
exports.addTally = async function (newTally) {
    try {
      const result = await collection_connection.create(newTally);
      console.log('New tally added to database:', result);
      return result;
    } catch (error) {
      console.error('Error adding new tally to database:', error);
      return error;
    }
  }
