const express = require("express")
const {check} = require("./middlewares")
const db = require("./db")

const router = express.Router()

router.use(check)

router.get("/", async (req, res) => {
    try {
        const {rows} = await db.query(`SELECT * FROM restaurants left join(SELECT restaurant_id, COUNT(*), trunc(AVG(rating),1) as average_rating from reviews GROUP BY restaurant_id) reviews on restaurants.id = reviews.restaurant_id;`)
        console.log(rows)
        res.status(200).json({
            status: "success",
            data: {
                restaurants: rows
            }
        })
    } catch (err) {
        res.status(200).json({
            status: 'failure',
            error: err
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const {rows: restaurantRows} = await db.query(`SELECT * FROM restaurants left join(SELECT restaurant_id, COUNT(*), trunc(AVG(rating),1) as average_rating from reviews GROUP BY restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1;  `, [id])
        const {rows: reviewRows} = await db.query(`SELECT * FROM reviews WHERE restaurant_id=$1`, [id])
        res.status(200).json({
            status: "success",
            data: {
                restaurants: restaurantRows,
                reviews: reviewRows
            }
        })
    } catch(err) {
        res.status(200).json({
            status: 'failure',
            error: err
        })
    }
})

router.post("/", async (req, res) => {
    try {
        const {name, location, price_range} = req.body
        const {rows} = await db.query(`INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *`, [name, location, price_range])
        console.log(rows)
        res.status(201).json({
            status: "success",
            data: {
                restaurants: rows
            }
        })
    } catch(err) {
        res.status(200).json({
            status: 'failure',
            error: err
        })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const {name, location, price_range} = req.body
        const {rows} = await db.query(`SELECT * FROM restaurants WHERE id=$1`, [id])
        if(!rows.length) {
            res.status(200).json({
                status: 'failure',
                error: 'Restaurant not found'
            })
        }
        const {rows: updatedRow} = await db.query(`UPDATE restaurants SET name=$1, location=$2, price_range=$3 WHERE id=$4 RETURNING *`, [name, location, price_range, id])
        console.log(updatedRow)
        res.status(200).json({
            status: "success",
            data: {
                restaurants: updatedRow
            }
        })
    } catch(err) {
        res.status(200).json({
            status: 'failure',
            error: err
        })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await db.query(`DELETE FROM restaurants WHERE id=$1`, [id])
        console.log(result)
        res.status(200).json({
            status: "success"
        })
    } catch(err) {
        res.status(200).json({
            status: 'failure',
            error: err
        })
    }
})

router.post("/:id/addReview", async (req, res) => {
    try {
        const id = req.params.id
        const {name, review, rating} = req.body
        const {rows} = await db.query(`INSERT INTO reviews (name, rating, review, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *`, [name, rating, review, id])
        res.status(201).json({
            status: 'success',
            data: {
                reviews: rows
            }
        })
    } catch(err) {
        res.status(200).json({
            status: 'failure',
            error: err
        })
    }
})

module.exports = router