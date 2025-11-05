const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing  = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// index route
router.get("/", wrapAsync(listingController.index));

// New Route for add new listing
 router.get("/new",isLoggedIn,listingController.renderNewForm

 );   

// Show Route
router.get("/:id",
     wrapAsync(listingController.showListing)
);


// create route for add new listing
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
);

// edit route
   router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.renderEditForm)
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
    wrapAsync(listingController.updateListing)
);

// delete route
  router.delete("/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.destroyListing)
    );

  module.exports = router;
 