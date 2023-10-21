const express = require("express");
const router = express.Router();
const testController = require("../Controller/testController");

router.route("/").post(testController.addData).get(testController.findAll);

router
  .route("/:id")
  .patch(testController.updateData)
  .delete(testController.deleteData);

module.exports = router;
