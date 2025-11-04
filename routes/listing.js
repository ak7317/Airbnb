const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing  = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


// index route

router.get("/", wrapAsync(async (req,res) => {
     const allListings= await Listing.find({});
     res.render("listings/index.ejs",{allListings});

    }));

// New Route for add new listing
 router.get("/new",isLoggedIn,(req,res) => {
      res.render("listings/new.ejs");
     });   

// Show Route
router.get("/:id",
     wrapAsync(async(req,res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
    // console.log(listing);
    }));


// create route for add new listing

router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req,res,next) => {

           const newListing = new Listing(req.body.listing);
           newListing.owner = req.user._id;
           await newListing.save();
           req.flash("success","New Listing Created!");
           res.redirect("/listings");

    })
);

// edit route
   router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(async (req,res) => {
        //  if(!req.body ||req.body.listing) {
        //     throw new ExpressError(400,"Send Valid data for listing");
        //   }
        let {id}= req.params;
        const listing = await Listing.findById(id);
        if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
        res.render("listings/edit.ejs", {listing});
    })
 );

    // Update Routr
    // router.put(
    //  "/:id",
    //  isLoggedIn,
    //  validateListing,
    //  wrapAsync(async(req,res) => {
    //   let {id}= req.params;
    //  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //  req.flash("success","Listing Updated!");
    //  res.redirect(`/listings/${id}`);

    //  }));

 // CORRECT Update Routr
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing, 
    wrapAsync(async(req,res) => {
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
     req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// delete route
  router.delete("/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(async(req,res) => {
        let {id} = req.params;
       let deletedListing = await Listing.findByIdAndDelete(id);
       console.log(deletedListing);
          req.flash("success"," Listing Deleted!");
       res.redirect("/listings");
    }));

    module.exports = router;
 