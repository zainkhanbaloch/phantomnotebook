const express = require('express')

const connectToMongo = require('./db')
const app = express()
const port = 80

var cors = require('cors')

app.use(cors())

connectToMongo();
app.use(express.json())

// Home Route
app.get("/", (req, res)=>{
  res.send("Hello World!")
})

// Available Routes
app.use("/api/auth", require("./routes/auth.js"))
app.use("/api/notes", require("./routes/notes"))

app.listen(port, () => {
  console.log(`iNotebook app listening on port http://localhost:${port}`)
})