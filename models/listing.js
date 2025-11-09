const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");

const listingSchema = new Schema ( {
    title: {
       type: String,
       required : true,
    },
    description: String,
    image: {
         url: String,
         filename: String,
       
   },
    //    from gemini
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
   owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
   },
});
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
     await Review.deleteMany({_id : {$in: listing.reviews}});
    }
 
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;