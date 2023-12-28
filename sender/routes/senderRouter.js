const Router = require("express")
const senderController = require("../controllers/senderController")

const router = new Router()

router.post('', senderController.sendNumber)

module.exports = router