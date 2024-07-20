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
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));
router.get( "/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification)
);
router.post("/new-classification", utilities.handleErrors(invController.addClassification)
);
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory)
);
router.post("/new-inventory", invValidate.vehicleRules(), invValidate.checkInvData, utilities.handleErrors(invController.addInventory)
);
router.get("/getInventory/:classification_id",  utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

router.post("/update/", utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteConfirmationView))

router.post("/delete-item", utilities.handleErrors(invController.deleteItem))

module.exports = router;
