var express = require("express");
const { uuid } = require('uuidv4')
var router = express.Router();
const { campioDB } = require("../mongo")


const createCamp = async (uuid, campName, address, campAmount, reserve) => {
    try {


        const collection = await campioDB().collection("camps")



        const camp = {

            campId: uuid,
            campName: campName,
            address: address,
            campAmount: campAmount,
            reserve: reserve

        }



        await collection.insertOne(camp)

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }

}

router.post('/createCamp', async function (req, res, next) {
    try {
        const campId = uuid()
        const campName = req.body.campName
        const address = req.body.address
        const campAmount = req.body.campAmount
        const reserve = req.body.reserve




        const campSaveSuccess = await createCamp(campId, campName, address, campAmount, reserve)
        if (campSaveSuccess) {
            res.json({ success: true })
        }
    } catch (error) {
        console.error(error)
        res.json({ success: false, errorMessage: error })
    }
})


const deleteCamp = async () => {
    try {
        const collection = await campioDB().collection("camps");
        await collection.deleteOne({
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};


router.delete("/delete-camp", async (req, res) => {
    try {
        await deleteCamp();
        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: String(e), success: false });
    }
});
const updateCampreserve = async (campId, reserve) => {
    try {
        const collection = await campioDB().collection("camps");

        const updatedCampreserve = {
            reserve: true
        }
        await collection.updateOne({ campId: campId }, {
            $set: {
                reserve: reserve
            }
        })
    } catch (e) {
        console.error(e);
    }
}

router.put("/edit-camp-reserve", async function (req, res) {
    try {
        const collection = await campioDB().collection("camps");

        const reserve = true
        const campId = req.body.campId



        const originalCamp = await collection.findOne({ campId: campId });


        if (!originalCamp) {
            res.status(200).json({ message: 'camp was not found', success: false });
            return;
        }
        await updateCampreserve(campId, reserve)
        res.status(200).json({ success: true, reserve });
    } catch (e) {
        console.error(e);
    }
})

const updateCamp = async (campId, campName, address, campAmount) => {

    try {
        const collection = await campioDB().collection("camps");

        const updatedcamp = {
            campName: campName,
            address: address,
            campAmount: campAmount,
        };

        await collection.updateOne(
            {
                campId: campId
            },
            {
                $set: {
                    campName,
                    address,
                    campAmount,
                }
            }

        );
    } catch (e) {
        console.error(e);
    }
};

router.put("/edit-camp", async function (req, res) {
    try {
        const collection = await campioDB().collection("camps");

        const campName = req.body.campName
        const address = req.body.address
        const campAmount = req.body.campAmount
        const campId = req.body.campId


        const originalCamp = await collection.findOne({ campId: campId });
        console.log('original camp: ', originalCamp.campId)




        if (!originalCamp) {
            res.status(200).json({ message: 'camp was not found', success: false });
            return;
        }


        await updateCamp(campId, campName, address, campAmount)




        res.status(200).json({ success: true, campName, address, campAmount });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: String(e), success: false });
    }
});

module.exports = router