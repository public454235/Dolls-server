const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vl0tdp1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db('babydolls').collection('servicesdoll');
    const servicesBarbieCollection = client.db('barbiedolls').collection('servicesBarbie');
    const servicesGirlCollection = client.db('girldolls').collection('servicesGirl');

    const bookingCollection = client.db('dollUser').collection('bookings')



    // servicesdoll


    app.get('/servicesdoll', async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result)
    })

    app.get('/servicesdoll/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {

        // Include only the `title` and `imdb` fields in the returned document
        projection: { Picture: 1, category: 1, Rating: 1, details: 1, price: 1, },
      };

      const result = await serviceCollection.findOne(query, options)
      res.send(result)
    })

    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking, 'user')
      const result = await bookingCollection.insertOne(booking)
      res.send(result)

    })

    app.get('/bookings', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = bookingCollection.find(query).limit(20)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.findOne(query)
      res.send(result)
    })

    // servicesBarbie
    app.get('/servicesBarbie', async (req, res) => {
      const result = await servicesBarbieCollection.find().toArray();
      res.send(result)
    })

    // 



    app.get('/servicesBarbie/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {

        // Include only the `title` and `imdb` fields in the returned document
        projection: { Picture: 1, category: 1, Rating: 1, details: 1, price: 1, },
      };

      const result = await servicesBarbieCollection.findOne(query, options)
      res.send(result)
    })


    // servicesGirl

    app.get('/servicesGirl', async (req, res) => {
      const result = await servicesGirlCollection.find().toArray();
      res.send(result)
    })

    app.get('/servicesGirl/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {

        // Include only the `title` and `imdb` fields in the returned document
        projection: { Picture: 1, category: 1, Rating: 1, details: 1, price: 1, },
      };

      const result = await servicesGirlCollection.findOne(query, options)
      res.send(result)
    })
    app.put('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const updateBookings = req.body;
      const rest = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateBooking = {
        // console.log(name, seller_name, email, category, Price, Rating, details, quantity, photo)
        $set: {
          name: updateBookings.name,
          seller_name: updateBookings.seller_name,
          email: updateBookings.email,
          category: updateBookings.category,
          Price: updateBookings.Price,
          details: updateBookings.details,
          photo: updateBookings.photo,

        }
      }
      const result = await bookingCollection.updateOne(rest, updateBooking, options)
      res.send(result)
    })

    // Delete 
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Doll is running')
})

app.listen(port, () => { console.log(`DOLLs is running on port: ${port}`) })