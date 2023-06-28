const express = require("express");
const bodyParser = require("body-parser");
const sqlite = require("sqlite3").verbose();
const cors = require("cors");


const app = express()
const db = new sqlite.Database('./database.db', (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
      console.log('Connected to the SQLite database');
      // Create the companies table if it doesn't exist
      db.run(`CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY,
        name TEXT,
        location TEXT
      )`, (createTableErr) => {
        if (createTableErr) {
          console.error(createTableErr.message);
        } else {
          console.log('Companies table created or already exists');
        }
      });
    }
  });

app.use(bodyParser.json())
app.use(cors());

// Return list of companies
app.get("/companies", (req, res) => {
    db.all("SELECT * FROM companies", (err, rows) => {
        if (err) {
            console.error(err.message)
            res.status(500).json('Internal Server Error');
        } else {
            res.status(200).json(rows)
        }
    })
})

// GET - Get company detail by ID

app.get("/company/:id", (req, res) => {
    const companyId = req.params.id
    db.get("SELECT * FROM companies WHERE id = ?", companyId, (err, row) => {
        if (err) {
            console.error(err.message)
            res.status(500).json('Internal Server Error');
        } else if (!row) {
            res.status(404).json("Company not found")
        } else {
            res.status(200).json(row)
        }

    })
})

// – Insert a new record

app.post("/company", (req, res) => {
    const { id, name, location } = req.body;
    db.run("INSERT INTO companies (id, name, location) VALUES (?,?,?)", [id, name, location], (err) => {
        if (err) {
            console.error(err.message)
            res.status(500).json('Internal Server Error');
        } else {
            res.status(201).json("Data insert Successfully")
        }
    })
})

// Update existing company details

app.put("/company/:id", (req, res) => {
    const companyId = req.params.id;
    const { name, location } = req.body;

    db.run("UPDATE companies SET name = ?, location = ? WHERE id = ?", [name, location, companyId], (err) => {
        if (err) {
            console.error(err.message)
            res.status(500).json('Internal Server Error');
        } else {
            res.status(200).json("Data update Successfully")
        }
    })
})

// Delete existing company details

app.delete("/company/:id", (req, res) => {
    const companyId = req.params.id;
    db.run("DELETE FROM companies WHERE id = ?", companyId, (err) => {
        if (err) {
            console.error(err.message)
            res.status(500).json('Internal Server Error');
        } else {
            res.status(200).json("Data delete Successfully")
        }
    })
})



const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})