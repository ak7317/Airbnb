const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing  = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res) => {
    res.send("Hi , I am root");
});

// index route

app.get("/listings",async (req,res) => {
     const allListings= await Listing.find({});
     res.render("listings/index.ejs",{allListings});

    });
    // New Route for add new listing
    app.get("/listings/new",(req,res) => {
        res.render("listings/new.ejs");
        });

       

    // Show Route
app.get("/listings/:id", async(req,res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
    // console.log(listing);
    });


    // create route for add new listing
app.post("/listings",async (req,res) => {
     // let {title,description,image,price,location,country} = req.body;
        // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
        // console.log(newListing);


    }); 

    // edit route
    app.get("/listings/:id/edit" , async (req,res) => {
        let {id}= req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {listing});
    });

    // Update Routr
    app.put("/listings/:id", async(req,res) => {
      let {id}= req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);
    //  res.redirect("/listings");
    // console.log(req.body);

    });

    // delete route
    app.delete("/listings/:id", async(req,res) => {
        let {id} = req.params;
       let deletedListing = await Listing.findByIdAndDelete(id);
       console.log(deletedListing);
       res.redirect("/listings");
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