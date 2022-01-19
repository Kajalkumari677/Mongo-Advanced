const express = require("express");
const mongoose = require("mongoose");

const connect = () => {
  return mongoose.connect("mongodb://127.0.0.1:27017/movie");
};

// MOVIE SCHEMA AND MODEL
const movieSchema = new mongoose.Schema(
  {
    id:{type:Number,required:true},
    movie_name: { type: String, required: true },
    movie_genere: { type: String, required: false },
    production_year: { type: String, required:false },
    budget: { type: Number, required: false},
    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Movie = mongoose.model("movie", movieSchema); 

const app = express();

app.use(express.json());

//CRUD  

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find().lean().exec(); 
    return res.send(movies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/movies", async (req, res) => {
  try {
    const movies = await Movie.create(req.body);

    return res.status(201).send(movies);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const movies = await Movie.findById(req.params.id).lean().exec();

    return res.status(200).send(movies);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/movies/:id", async (req, res) => {
  try {
    const movies = await Movie.findByIdAndUpdate(req.params.id,
      req.body, 
      {
      new: true,
     })
      .lean()
      .exec();

    return res.status(201).send(movies);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/movies/:id", async (req, res) => {
  try {
    const movies = await Movie.findByIdAndDelete(req.params.id).lean().exec();

    return res.status(200).send(movies);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen(6789, async () => {
  try {
    await connect();
    console.log("listening on port 6789");
  } catch (e) {
    console.log(e.message);
  }
});
