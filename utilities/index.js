const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
// Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

module.exports = Util

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


  Util.buildInventoryDetails = async function(data){
    let details = '';
    if(data.inv_id){
      details +=`<h1 id='year-make-model'>${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>`
      details += `<div id='details_wrapper'> <img id='details_image' src= ${data.inv_image} alt='Picture of Vehicle'>`
      details += `<div id='car_specs'><h2 id='details_description_title'>${data.inv_make} ${data.inv_model} Details</h2>`
      details += `<p id= 'details_price'><strong>Price: </strong>${formatter.format(data.inv_price)}</p>`
      details += `<p id='details_description'><strong>Description: </strong>${data.inv_description}</p>`
      details += `<p id='details_color'><strong>Color: </strong>${data.inv_color}</p>`
      details += `<p id='details_miles'><strong>Miles: </strong>${numberWithCommas(data.inv_miles)}</p></div></div>`
    } else { 
      details += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return details
  }

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

Util.checkAccountType = (req, res, next) => {
  if ((res.locals.accountData.account_type == 'Employee' || res.locals.accountData.account_type == 'Admin') && res.locals.loggedin){
    next()
  }else {
    req.flash("notice", "Invalid Permissions")
    return res.redirect("/account/login")
  }
}

Util.checkAdmin = (req, res, next) => {
  if (res.locals.accountData.account_type == 'Admin') {
    next()
  }else {
    req.flash("notice", "Invalid Permissions")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.buildClassificationList = async function (classification_id = '') {
  let data = await invModel.getClassifications()
  let list = `<select id='classificationList' name='classification_id' value="${classification_id}">`
  list += `<option  selected disabled hidden>Choose Classification</option>`
  data.rows.forEach((row) => {
    list += `<option value='${row.classification_id}'>`
    list += row.classification_name
    list += "</option>"
  })
  list += "</select>"
  return list
}




Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



