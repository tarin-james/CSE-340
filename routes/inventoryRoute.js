// Needed Resources
const express = require("express");
const utilities = require("../utilities");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInvId)
);
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/new-classification",
  utilities.handleErrors(invController.addClassification)
);
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/new-inventory",
  invValidate.vehicleRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
