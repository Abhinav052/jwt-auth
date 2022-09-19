const express = require('express')
require('dotenv').config();
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const authentication = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    console.log(accessToken)
    if (accessToken == null) res.status(403).send();
    // const check = jwt.verify(accessToken, process.env.SECRET_ACCESSTOKEN)
    // console.log(check + " TOKEN VERIFICATION")
    jwt.verify(accessToken, process.env.SECRET_ACCESSTOKEN, (err, tokenPayload) => {
        if (err) res.status(400).send(err)
        console.log(tokenPayload)
    })
    next()
}

app.get('/', authentication, (req, res) => {
    // console.log(req.body);
    res.status(201).send('Success: real jod awakens')
})

app.post('/login', (req, res) => {
    const userName = req.body.name;
    const tokenPayload = { name: userName, admin: true }
    const accessToken = jwt.sign(tokenPayload, process.env.SECRET_ACCESSTOKEN)
    console.log(accessToken)
    res.json({ accessToken: accessToken })
    // res.status(201).send('Success')
})




app.listen(8000, 'localhost', (err) => {
    if (err) console.log(err);
    else console.log('Server running on port 8000')
})