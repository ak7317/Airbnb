const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing  = require("./models/listing.js");
// for ejs
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");
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

// for server side validation for listing
const validateListing = (req,res,next) =>{
     let {error} =  listingSchema.validate(req.body);
           if(error) {
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, errMsg);
           }
           else {
            next();
           }
}

// for server side validation for review
const validateReview= (req,res,next) =>{
     let {error} =  reviewSchema.validate(req.body);
           if(error) {
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, errMsg);
           }
           else {
            next();
           }

}

// index route

app.get("/listings", wrapAsync(async (req,res) => {
     const allListings= await Listing.find({});
     res.render("listings/index.ejs",{allListings});

    }));
    // New Route for add new listing
    app.get("/listings/new",(req,res) => {
        res.render("listings/new.ejs");
        });

       

    // Show Route
app.get("/listings/:id", wrapAsync(async(req,res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
    // console.log(listing);
    }));


    // create route for add new listing

app.post("/listings",validateListing,wrapAsync(async (req,res,next) => {
//     try {
//  // let {title,description,image,price,location,country} = req.body;
//         // let listing = req.body.listing;
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//         // console.log(newListing);
//     }
//     catch(err) {
//         next(err);
//     }
         // using wrapasynch
        //  let {title,description,image,price,location,country} = req.body;
        // we use joi
          // let listing = req.body.listing;
        //   if( !req.body ||!req.body.listing) {
        //     throw new ExpressError(400,"Send Valid data for listing");
        //   }
        //   const newListing = new Listing(req.body.listing);
        //   if(!newListing.title) {
        //     throw new ExpressError(400,"Title is missing");
        //   }
        //   if(!newListing.description) {
        //     throw new ExpressError(400,"Description is missing");
        //   }
        //   if(!newListing.location) {
        //      throw new ExpressError(400,"location is missing");
        //   }
        //   let result =  listingSchema.validate(req.body);
        //   console.log(result);
        //    if(result.error) {
        //     throw new ExpressError(400, result.error);
        //    }
           const newListing = new Listing(req.body.listing);
           await newListing.save();
           res.redirect("/listings");
        // console.log(newListing);
    


    })
);

    // edit route
    app.get("/listings/:id/edit" , wrapAsync(async (req,res) => {
         if(!req.body ||req.body.listing) {
            throw new ExpressError(400,"Send Valid data for listing");
          }
        let {id}= req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {listing});
    }));

    // Update Routr
    // app.put("/listings/:id", async(req,res) => {
    //   let {id}= req.params;
    //  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //  res.redirect(`/listings/${id}`);
    // //  res.redirect("/listings");
    // // console.log(req.body);

    // });

    // CORRECT Update Routr
app.put("/listings/:id",validateListing, wrapAsync(async(req,res) => {
    let {id}= req.params;
    
    // 1. Get the listing data from the form
    let listingData = req.body.listing;

    // 2. MANUALLY FIX the nested image data structure
    if (listingData.image) {
        listingData.image = {
            // The incoming string from the form is the URL
            url: listingData.image, 
            // Default filename (needed for the schema to work)
            filename: 'listingimage' 
        };
    } 
    // If the image field was left blank, the schema's default will apply automatically, 
    // so no need for an explicit 'else' block for the default placeholder.

    // 3. Update the database with the corrected data structure
    await Listing.findByIdAndUpdate(id, listingData);
    
    res.redirect(`/listings/${id}`);
}));

    // delete route
    app.delete("/listings/:id", wrapAsync(async(req,res) => {
        let {id} = req.params;
       let deletedListing = await Listing.findByIdAndDelete(id);
       console.log(deletedListing);
       res.redirect("/listings");
    }));
 
    // Review
    // Post Review Route
    app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res) =>{
         console.log("➡️ Review POST route hit once");
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        // console.log("new review saved");
        // res.send("new review saved");
        console.log("✅ Review saved:", newReview);
        res.redirect(`/listings/${listing._id}`);

    }));
// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}));

    

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

// 404 Handler: Catch all unhandled routes
app.use((req,res,next) => {
    next(new ExpressError(404,"Page not found!"));
});

 // middleware for errr handler
 app.use((err,req,res,next) => {
    // let {statusCode,message} = err;
    // res.staus(statusCode).send(message);
    // // res.send("Something went wrong!");
      let {statusCode = 500, message = "Something went wrong!"} = err;
    
    //  res.status(statusCode).render("error.ejs",{message});
    //  res.render("error.ejs",{message});
    

    res.status(statusCode).send(`Error ${statusCode}: ${message}`);
    //  res.status(statusCode).render("error.ejs", { message });
  
 });
app.listen(8080,() => {
    console.log("app is listening on 8080");
});

