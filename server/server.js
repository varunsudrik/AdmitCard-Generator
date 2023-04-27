const express = require("express");
const app = express();
require("dotenv").config();

const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

// Define contact schema
const admitSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  school: String,
  clas: Number,
  roll_number: Number,
  address: String,
});

const Contact = mongoose.model("Contact", admitSchema);

// Set up middleware
app.use(bodyParser.json());

// Handle POST request to /api/contact
app.post("/api/contact", async (req, res) => {
  try {
    // Create new contact object with name and phone number from request body
    const { name, phoneNumber, school, clas, roll_number, address } = req.body;
    const newAdmit = new Contact({
      name,
      phoneNumber,
      school,
      clas,
      roll_number,
      address,
    });

    // Save contact to MongoDB
    await newAdmit.save();

    // Generate PDF with contact details

    const browser = await puppeteer.launch({ headless: "new" });

    //2 const browser = await puppeteer.launch({ headless: true });
    //const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(
      `<html><body><h1>Admit Card: </h1>
      <p>Name: ${newAdmit.name}</p>
      <p>Phone Number: ${newAdmit.phoneNumber}</p>
      <p>Phone Number: ${newAdmit.school}</p>
      <p>Phone Number: ${newAdmit.clas}</p>
      <p>Phone Number: ${newAdmit.roll_number}</p>
      <p>Phone Number: ${newAdmit.address}</p>
      </body></html>`
    );
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    const pdfFileName = `${newAdmit.name}.pdf`;
    const pdfFilePath = path.join(__dirname, pdfFileName);
    require("fs").writeFileSync(pdfFilePath, pdfBuffer);

    res
      .status(200)
      .send(
        `<a href="/api/contact/${pdfFileName}" download="${pdfFileName}">Click to Download PDF</a>`
      );
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Serve PDF file
app.get("/api/contact/:fileName", (req, res) => {
  const filePath = path.join(__dirname, req.params.fileName);
  res.download(filePath, req.params.fileName);
});

app.get("/test", (req, res) => {
  res.status(200).send("Server Working");
});

// Start server
const port = process.env.PORT || 6700;
app.listen(port, () => console.log(`Server listening on port ${port}`));
