const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/complaintDB")
.then(() => console.log("MongoDB Connected 🔥"))
.catch(err => console.log(err));

// ===================== SCHEMA =====================

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// ===================== ROUTES =====================

// 🔥 Add complaint
app.post("/api/complaints/add", async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.json({ message: "Complaint Added ✅" });
  } catch (error) {
    res.status(500).json({ error: "Error adding complaint" });
  }
});

// 🔥 Get all complaints
app.get("/api/complaints", async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching complaints" });
  }
});

// 🔥 Update status
app.put("/api/complaints/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error updating status" });
  }
});

// 🔥 DELETE complaint (NEW)
app.delete("/api/complaints/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting complaint" });
  }
});

// 🔐 LOGIN SYSTEM (simple admin)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "1234") {
    res.json({ success: true, message: "Login Success 🔥" });
  } else {
    res.json({ success: false, message: "Invalid Credentials ❌" });
  }
});

// ===================== SERVER =====================

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});