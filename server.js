const express = require('express')
require('dotenv').config();
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
let validRefresh = []
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

app.post('/token', (req, res) => {
    refreshToken = req.body.token;
    if (refreshToken == null) return res.status(403).send("Forbidden")
    if (validRefresh.includes(refreshToken) == false) return res.status(401).send("Forbidden")
    jwt.verify(refreshToken, process.env.SECRET_REFRESHTOKEN, (err, tokenPayload) => {
        payload = { name: tokenPayload.name, admin: tokenPayload.admin };
        accessToken = createAccessToken(payload);
        res.json({ accessToken: accessToken })
    })
})

app.get('/', authentication, (req, res) => {
    // console.log(req.body);
    res.status(201).send('Success: real jod awakens')
})

app.delete('/logout', (req, res) => {
    validRefresh = validRefresh.filter(token => token !== req.body.token)
    res.status(201).send()
})

app.post('/login', (req, res) => {
    const userName = req.body.name;
    const tokenPayload = { name: userName, admin: true }
    const accessToken = createAccessToken(tokenPayload)
    const refreshToken = createRefreshToken(tokenPayload)
    // console.log(accessToken)
    validRefresh.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
    // res.status(201).send('Success')
})

function createAccessToken(tokenPayload) {
    return jwt.sign(tokenPayload, process.env.SECRET_ACCESSTOKEN, { expiresIn: '10s' })
}

function createRefreshToken(tokenPayload) {
    return jwt.sign(tokenPayload, process.env.SECRET_REFRESHTOKEN)
}


app.listen(8000, 'localhost', (err) => {
    if (err) console.log(err);
    else console.log('Server running on port 8000')
})