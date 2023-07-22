const express = require("express")
const router = express.Router()
const { contactUsController } = require("../controllers/ContactUs")

router.post("/reach/contact", contactUsController)

module.exports = router