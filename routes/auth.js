var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');
const { campioDB } = require("../mongo")
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const createUser = async (username, firstName, lastName, phoneNumber, hash, campReserve) => {
    try {
        // Save user functionality
        const collection = await campioDB().collection("users")

        const user = {
            email: username,
            firstName: firstName,
            password: hash,
            lastName: lastName,
            phoneNumber: phoneNumber,
            uuid: uuid()

        }

        await collection.insertOne(user)

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }

}
router.post("/register-user", async function (req, res, next) {
    try {
        const username = req.body.email
        const firstName = req.body.firstName
        const password = req.body.password
        const lastName = req.body.lastName
        const phoneNumber = req.body.phoneNumber

        const saltRounds = 5
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        const userSaveSuccess = await createUser(username, firstName, lastName, phoneNumber, hash);
        if (userSaveSuccess) {
            res.json({ success: true })
        }
    } catch (error) {
        console.error(error)
        res.json({ success: false, errorMessage: error })
    }
})

router.post('/login-user', async function (req, res, next) {
    try {
        const collection = await campioDB().collection('users')
        // console.log(collection)
        // console.log(req.body.email)

        const user = await collection.findOne({
            email: req.body.email
        })

        console.log(user)
        const match = await bcrypt.compare(req.body.password, user.password);
        // console.log(match)
        res.json({ success: match })

    } catch (error) {
        console.log(error)
    }



})

router.get("/validate-token", function (req, res, bext) {
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const token = req.header(tokenHeaderKey);

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.json({ success: true });
        } else {
            // Access Denied
            throw Error("Access Denied")
        }
    } catch (error) {
        // Access Denied
        return res.status(401).json({ success: true, message: String(error) });
    }
})

const findUsers = async () => {
    try {
        const collection = await campioDB().collection("users");

        return await collection.find({}).toArray();
    } catch (e) {
        console.error(e);
    }
};

router.get("/all-users", async function (req, res, next) {


    const allUsers = await findUsers();
    // console.log(allCamps)
    res.json({ users: allUsers });
});


const deleteUser = async () => {
    try {
        const collection = await campioDB().collection("users");
        await collection.deleteOne({
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};


router.delete("/delete-user", async (req, res) => {
    try {
        await deleteUser();
        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: String(e), success: false });
    }
});




module.exports = router