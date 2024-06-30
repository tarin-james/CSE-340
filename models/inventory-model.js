const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/* ***************************
 *  Get an inventory item and inventory details by inventory_id
 * ************************** */
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS inventory
      WHERE inventory.inv_id = $1`,
      [inv_id]
    )
    return data.rows?.[0];
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error)
  }
}

  module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId};