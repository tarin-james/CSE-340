const utilities = require("../utilities/")
const accountModel = require("../models/account-model") 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }
  

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
  })
}

async function buildAccountManager(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accountManagement" , {
    title: "Account Management",
    nav,
    errors:null,
  
  })
}


  
  
  /* ****************************************
  *  Process Registration
  * *************************************** */
 async function registerAccount(req, res) {
   let nav = await utilities.getNav()
   const { account_firstname, account_lastname, account_email, account_password } = req.body

   let hashedPassword
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
   } catch (error) {
     req.flash("notice", 'Sorry, there was an error processing the registration.')
     res.status(500).render("account/register", {
       title: "Registration",
       nav,
       errors: null,
     })
   }

   const regResult = await accountModel.registerAccount(
     account_firstname,
     account_lastname,
     account_email,
     hashedPassword
    )

    
    
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogout(req,res) {
  try {
    res.clearCookie('jwt')
   return res.redirect("/")
   }
   catch (error) {
   return new Error('Error Logging Out')
  }
 }


 async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/updateAccount" , {
    title: "Account Details",
    nav,
    errors:null,
  
  })
}


 async function updateAccountInfo (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
   
    req.flash("notice", `Your account was successfully updated.`)
    res.status(200).render("account/accountManagement", 
      {
        title: "Account Details ",
        nav,
        error: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      }
    )
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/updateAccount", {
    title: "Account Details ",
    nav,
    error: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }


}

async function changePassword (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_password,
    account_id
  } = req.body
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the change.')
    res.status(500).render("account/updateAccount", {
      title: "Account Details",
      nav,
      errors: null,
    })
  }
  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )



  if (updateResult) {
   
    req.flash("notice", `Your password was successfully changed.`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/updateAccount", {
    title: "Account Details ",
    nav,
    errors: null,
    hashedPassword,
    account_id
    })
  }

  
}

async function buildAccountPermissions(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-permissions" , {
    title: "Account Permissions",
    nav,
    errors:null,
  
  })
}

async function updateAccountPermissions (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_type,
    account_email

  } = req.body
  const updateResult = await accountModel.updatePermissions(
    account_type,
    account_email
  )

  if (updateResult) {
   
    req.flash("notice", `The account was successfully updated.`)
    res.status(200).render("account/accountManagement", 
      {
        title: "Account Permissions ",
        nav,
        error: null,
        account_type,
        account_email

      }
    )
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/account-permissions", {
      title: "Account Permissions ",
      nav,
      error: null,
      account_type,
      account_email
    })
  }


}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManager, accountLogout, buildUpdateAccount, updateAccountInfo, changePassword, buildAccountPermissions, updateAccountPermissions }