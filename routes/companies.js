const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db")


/** GET /companies : Returns list of companies */
router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`SELECT code, name FROM companies`);
    return res.json({ companies: results.rows });
  } catch (err) {
    return next(err);
  }
});

/** GET /companies/[code] : Return obj of company */
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query(
      `SELECT code, name, description FROM companies WHERE code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }

    return res.json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** POST /companies : Adds a company */
router.post('/', async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const result = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** PUT /companies/[code] : Edit existing company */
router.put('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;
    const result = await db.query(
      `UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description`,
      [name, description, code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }

    return res.json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /companies/[code] : Deletes company */
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query(`DELETE FROM companies WHERE code = $1 RETURNING code`, [code]);

    if (result.rows.length === 0) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }

    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
