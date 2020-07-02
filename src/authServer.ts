import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { UserAuthentication } from './domain/user-authentication';
// tslint:disable-next-line:no-var-requires
require('dotenv').config();


const app = express();

app.use(bodyParser.json())

interface User {
    username: string,
    password: string
}

let refreshTokens : string[] = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    // @ts-ignore
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user : User) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken(user);
        res.json({ accessToken })
    })
})

app.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = { username, password };

    // @ts-ignore
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken)

    res.json({ accessToken, refreshToken })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

function generateAccessToken(user : UserAuthentication) {
    // @ts-ignore
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
}

function generateRefreshToken(user : UserAuthentication) {
    // @ts-ignore
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.listen(3000, () => console.log('Example app listening on port'))
