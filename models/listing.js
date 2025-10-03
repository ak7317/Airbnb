const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ( {
    title: {
       type: String,
       required : true,
    },
    description: String,
    image: {
         filename: {
            type: String,
         },
         url: {
            type:String,
            default: "https://unsplash.com/photos/river-in-the-middle-of-green-grass-and-trees-XY9x47itiZM",
             set: (v) => v === "" ? "https://unsplash.com/photos/river-in-the-middle-of-green-grass-and-trees-XY9x47itiZM" 
         : v,

         },
      

        
    },
    price:Number,
    location:String,
    country: String
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;