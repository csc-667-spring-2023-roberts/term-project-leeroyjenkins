const express = require("express");
const router = express.Router();

router.get("/", (request, response) =>{
    response.render("home",{
        title: "Alright",
        message: "LEEEEROYYYYY JEEENKINS",
    })
})

module.exports = router