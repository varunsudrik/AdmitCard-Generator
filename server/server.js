// Import necessary packages and modules
const express = require("express");
const app = express();
require("dotenv").config();

const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Set up middleware to parse incoming requests
app.use(bodyParser.json({  extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using the URL specified in the .env file
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

// Define the schema for the contact object
const admitSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  school: String,
  clas: Number,
  roll_number: Number,
  address: String,
});

// Create a model for the contact object
const Contact = mongoose.model("Contact", admitSchema);

// Set up middleware to handle JSON requests
app.use(bodyParser.json());

// Handle POST requests to /api/contact
app.post("/api/contact", async (req, res) => {
  try {
    // Extract the necessary data from the request body
    const { name, phoneNumber, school, clas, roll_number, address } = req.body;

    // Create a new contact object with the extracted data
    const newAdmit = new Contact({
      name,
      phoneNumber,
      school,
      clas,
      roll_number,
      address,
    });

    // Save the new contact object to MongoDB
    await newAdmit.save();

    // Generate a PDF containing the contact details
    const browser = await puppeteer.launch({ headless: "new" });
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

    // Save the PDF file to the server's directory
    const pdfFileName = `${newAdmit.name}.pdf`;
    const pdfFilePath = path.join(__dirname, pdfFileName);
    require("fs").writeFileSync(pdfFilePath, pdfBuffer);

    // Send a response to the client with a link to download the PDF
    res
      .status(200)
      .send(
        `<a href="/api/contact/${pdfFileName}" download="${pdfFileName}">Click to Download PDF</a>`
      );
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).send(error);
  }
});

// Serve PDF file when requested by the client
app.get("/api/contact/:fileName", (req, res) => {
  const filePath = path.join(__dirname, req.params.fileName);
  res.download(filePath, req.params.fileName);
});

// Set up a test endpoint to verify that the server is working
app.get("/test", (req, res) => {
  res.status(200).send("Server Working");
});

// Start the server and listen for incoming requests on the specified port
const port = process.env.PORT || 6700;
app
