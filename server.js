const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


require("dotenv").config();
const app = express();
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Admin Schema 
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

// Manually Insert Admin 
async function createAdmin() {
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await Admin.create({ username: "admin", password: hashedPassword });
        console.log("Admin created");
    }
}
createAdmin();


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
  
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    res.json({ token });
  });
  


app.get("/verify", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        res.json({ username: decoded.username });
    });
});

// Start Server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));