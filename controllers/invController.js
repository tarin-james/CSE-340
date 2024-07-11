const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const details = await utilities.buildInventoryDetails(data)
  let nav = await utilities.getNav()
  res.render("./inventory/invDetails", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    details
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav
  })
}

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { addClassification } = req.body

  const classificationResult = await invModel.addNewClassification(
    addClassification
   )

 if (classificationResult) {
   req.flash(
     "notice",
     `New Classification Successfully Added.`
   )
   res.status(201).render("./inventory/management", {
     title: "Vehicle Management",
     nav,
   })
 } else {
   req.flash("notice", "Sorry, adding the classification failed.")
   res.status(501).render("./inventory/add-classification", {
     title: "Add New Classification",
     nav
   })
 }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await invCont.getClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_model, inv_make, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const inventoryResults = await invModel.addNewInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
   )

   console.log('we are here we are here we are here' + inventoryResults)
 if (inventoryResults) {
   req.flash(
     "notice",
     `New Vehicle Successfully Added.`
   )
   res.status(201).render("./inventory/management", {
     title: "Vehicle Management",
     nav,
   })
 } else {
   req.flash("notice", "Sorry, the Vehicle Registration Failed.")
   res.status(501).render("./inventory/add-inventory", {
     title: "Add New Vehicle",
     nav,
     errors: null
   })
 }
}

invCont.getClassificationList = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<select id='classification_id' name='classification_id'>"
  data.rows.forEach((row) => {
    list += `<option value='${row.classification_id}'>`
    list += row.classification_name
    list += "</option>"
  })
  list += "</select>"
  return list
}


module.exports = invCont