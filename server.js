const express = require("express")
const app = express()
const connectDB = require("./config/db")
const PORT = process.env.PORT || 5000

// Connect database
connectDB();

// Init middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => {
    res.json({ msg: 'Welcome to contact list application' })
})
// Define routes
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/contacts", require("./routes/contacts"))
app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
//45