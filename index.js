const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.qlha3qo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const BookCollection = client.db("BookStore").collection("books");
    const BookingCollection = client.db("BookStore").collection("bookings");
    const ContactCollection = client.db("BookStore").collection("contact");

    // books get
    app.get("/books", async (req, res) => {
      const cursor = BookCollection.find();
      const books = await cursor.toArray();
      res.send(books);
    });

    //booking book

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await BookingCollection.insertOne(booking);
      res.send(result);
    });

    // contact Collection
    app.post("/contact", async (req, res) => {
      const booking = req.body;
      const result = await ContactCollection.insertOne(booking);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("the book store is running");
});

app.listen(port, () => {
  console.log(`the port is running on his own server ${port}`);
});
