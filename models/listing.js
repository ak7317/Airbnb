const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema ( {
    title: {
       type: String,
       required : true,
    },
    description: String,
   //  image: {
   //       filename: {
   //          type: String,
   //       },
   //       url: {
   //          type:String,
   //          default: "https://unsplash.com/photos/river-in-the-middle-of-green-grass-and-trees-XY9x47itiZM",
   //           set: (v) => v === "" ? "https://unsplash.com/photos/river-in-the-middle-of-green-grass-and-trees-XY9x47itiZM" 
   //       : v,

   //       },
       // from gemini
        image: {
        url: {
            type: String,
            // Use a working placeholder URL for the default
            default: "https://placehold.co/400x300", 
            // The setter function handles saving a provided URL or using the default if the input is empty
            set: (v) => v === "" ? "https://placehold.co/400x300" : v,
        },
        filename: String // Retain this for Cloudinary integration
    

        
    },
    price:Number,
    location:String,
    country: String,
    reviews : [
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
   ],
});
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
     await Review.deleteMany({_id : {$in: listing.reviews}});
    }
 
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;