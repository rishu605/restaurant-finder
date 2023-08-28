const check = (req, res, next) => {
    console.log("Run Check middleware")
    next()
}

module.exports = {
    check
}