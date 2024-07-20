const inventoryModel = require("../models/inventory-model")
const inventoryController =  require("../controllers/invController")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


validate.vehicleRules = () => {
    return [
      // vehicle_make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle make."), // on error this message is sent.
  
      // lastname is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle model."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A description is required."),
  
      // password is required and must be strong password
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Vehicle image is required."),

      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Vehicle thumbnail is required."),     

      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Vehicle price is required."),

      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .isLength({ max: 4 })
        .withMessage("Vehicle year is required."),

      body("inv_miles")
        .trim()
        .escape()
        .isInt()
        .notEmpty()
        .withMessage("Vehicle odometer reading is required."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Vehicle color is required.")
    ]
  }
  
  
  /* ******************************
   * Check data and return errors or continue to registration
   * ***************************** */
  validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    let classificationList = await utilities.buildClassificationList();
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Vehicle",
        nav,
        classificationList,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      })
      return
    }
    next()
  }



  /* ******************************
   * Check update data and return errors 
   * ***************************** */
  validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    let classificationList = await utilities.buildClassificationList();
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/edit-inventory", {
        errors,
        title: "Edit " + itemName,
        nav,
        classificationList,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id
      })
      return
    }
    next()
  }
  
  module.exports = validate