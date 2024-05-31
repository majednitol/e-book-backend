const express = require('express')
const app = express()
app.get('/naim', (req,res) => {
    res.status(200).json({name:'majed'})
})

app.listen(3000, () => {
    console.log('server starting at 3000 port')
})
