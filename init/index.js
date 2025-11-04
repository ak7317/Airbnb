const  mongoose  = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");


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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
        ...obj, 
        owner: "69078e135fb98e1415933f56",
    }));
    await Listing.insertMany(initData.data);
    //  await Listing.deleteMany({});
    console.log("data was initilize");
    
}
initDB();