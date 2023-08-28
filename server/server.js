const express = require("express")
const morgan = require("morgan")
require("dotenv").config()
const cors = require("cors")

const restaurantRouter = require("./routes")

const PORT = process.env.PORT || 4000

const app = express()
app.use(express.json())
app.use(cors())

app.use(morgan("dev"))

app.use("/api/v1/restaurants", restaurantRouter)

app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`)
})