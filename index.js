
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



//database

const uri = "mongodb+srv://anikdev100:LdZ6DtFsJbrMxdOR@cluster0.yx9wbzb.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const productCollection = client.db("brandDB").collection("products");
    const userCollection = client.db("brandDB").collection("users")

    //get operation
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    //post product or creat product
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    //delete operation
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })








    // user related

    //get
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //post
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    //patch or update
    app.patch('/users', async (req, res) => {
      const user = req.body;
      const filter = {
        email: user.email
      }
      const updatedDocument = {
        $set: {
          lastLoggedAtTime: user.lastLoggedAtTime
        }
      }
      const result = await userCollection.updateOne(filter, updatedDocument);
      res.send(result);
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
  res.send('Brand shop server is running')
})

app.listen(port, () => {
  console.log(`Brand shop server is listening on ${port}`);
})