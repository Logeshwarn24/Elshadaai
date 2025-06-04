const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));


// Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    work: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: Number, required: true },
});
const Contact = mongoose.model("Contact", contactSchema);

// Serve Frontend Files
const frontendPath = path.join(__dirname, "../elshaddai/"); // Updated path
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Contact Form Submission
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message, work, phone } = req.body;
        if (!name || !email || !message || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContact = new Contact({ name, email, message, phone, work });
        await newContact.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nPhone: ${phone}\nWorker_name: ${work}`, // Changed "Number" to "Phone"
        });

        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));