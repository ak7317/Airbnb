const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing  = require("./models/listing.js");
// for ejs
const path = require("path");

// for db connect

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connect to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);

}
// for ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true})); // for data parsing in show route


app.get("/",(req,res) => {
    res.send("Hi , I am root");
});

// index route

app.get("/listings",async (req,res) => {
     const allListings= await Listing.find({});
     res.render("listings/index.ejs",{allListings});

    });

    // Show Route
app.get("/listings/:id", async(req,res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
    console.log(listing);
    });

// create new route test listing



// app.get("/testlisting", async(req,res) => {
//      let samplelisting = new Listing ( {
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute , Goa",
//         country: "India",
//      });
//      await samplelisting.save();
//      console.log("sample was save");
//      res.send("successful testing");

// });
app.listen(8080,() => {
    console.log("app is listening on 8080");
});