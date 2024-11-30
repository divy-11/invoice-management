const expess = require("express");
const router = expess.Router();
const invoiceRoute = require("./invoice");
router.use("/invoice", invoiceRoute)
module.exports = router