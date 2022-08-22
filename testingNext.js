const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log("first middleware");
    return next();
    console.log("after next in first middleware");
},
(req,res,next) => {
    console.log("second callback");
    return next();
});

app.use((req, res, next) => {
    console.log("second middleware");
    console.log("after next in second middleware");
    next("KD");
});

app.use((err,req,res,next) => {
    console.log("error handler");
    next();
})

app.listen(3000, (e) => {
    console.log("Server is Successfully Running, and App is listening on port "+ 3000)
});