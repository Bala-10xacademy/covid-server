const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const {tallySchema}=require('./schema');

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get('/', (req, res) => {
  res.send("working")
});

app.get('/totalRecovered', async (req, res) => {
  try {
      const data = await tallySchema.find();
      let total = 0;
      for (i = 0; i < data.length; i++) {
          total += data[i].recovered
      }
      res.status(200).json({
          data: { _id: "total", recovered: total },

      })
  } catch (error) {
      res.status(500).json({
          sta: "failed",
          message: error.message
      })
  }

})
app.get('/totalActive', async (req, res) => {

    try {
        const data = await tallySchema.find();
        let total = 0;
        for (i = 0; i < data.length; i++) {
            total += data[i].infected
        }
        res.status(200).json({
            data: { _id: "total", infected: total },
  
        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }

})
app.get('/totalDeath', async (req, res) => {
    try {
        const data = await tallySchema.find();
        let total = 0;
        for (i = 0; i < data.length; i++) {
            total += data[i].death
        }
        res.status(200).json({
            data: { _id: "total", death: total },
  
        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }

})
app.get('/hotspotStates', async (req, res) => {

    try {
        const data = await tallySchema.find();
        const hotspotStates = [];
        for (let i = 0; i < data.length; i++) {
            const { infected, recovered } = data[i];
            const rate = ((infected - recovered) / infected).toFixed(5);
            if (rate > 0.1) {
                hotspotStates.push({ state: data[i].state, rate });
            }
        }
    
        res.status(200).json({
            data: hotspotStates,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message,
        });
    }

})
app.get('/healthyStates', async (req, res) => {
 
    try {
        const data = await tallySchema.find();
        const states=[];
        for (i = 0; i < data.length; i++) {
            let mortality=data[i].death/data[i].infected;
            if(mortality<0.005){
                states.push({state:data[i].state,mortality:mortality})
            }
          
        }
        res.status(200).json({
            data: states,
  
        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }
})


  
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;