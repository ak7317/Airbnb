const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOption = {
    secret: "mysupersecretstring",
     resave: false, 
     saveUninitialized: true
}

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=> {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// storing and using session info
app.get("/register",(req,res)=> {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    // console.log(req.session.name);
    // res.send(name);
    if(name === "anonymous") {
        req.flash("error","user not registered");
    }
    else {
    req.flash("success","user register succeessully");
    }
    res.redirect("/hello");
});
app.get("/hello",(req,res) =>{
    // res.send(`hello, ${req.session.name}`);
    // res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});
    // using res.locals
    res.render("page.ejs",{name:req.session.name});
});
//     if(req.session.count) {
//          req.session.count++;
//     }
//     else {
//          req.session.count = 1;
//     }
   
//     res.send(`You sent  request ${req.session.count}  times`);
// });
// app.get("/test",(req,res) =>{
//     res.send("test successful");
// });

app.listen(3000,() =>{
    console.log("server is listening on 3000");
});
