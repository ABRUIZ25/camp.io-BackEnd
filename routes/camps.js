var express = require("express");
var router = express.Router();
const { uuid } = require('uuidv4');

const { campioDB } = require("../mongo");

const findCamps = async () => {
    try {
        const collection = await campioDB().collection("camps");

        return await collection.find({}).toArray();
    } catch (e) {
        console.error(e);
    }
};


router.get("/all-camps", async function (req, res, next) {


    const allCamps = await findCamps();
    // console.log(allCamps)
    res.json({ camps: allCamps });
});
module.exports = router;