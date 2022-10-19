'use strict'

import 'dotenv/config'
import express, { query } from "express"
import bodyParser from "express";
import {pool} from "./db.mjs";
import path from "path";

const app = express()
const PORT = process.env.PORT
const db = pool

app.get('/username/:username', (req, res) => {
    let username = req.params.username
    db.query(`SELECT * from usernames where username='${username}'`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } if (results.length === 0) {
            return res.status(404).json({'error': 'Username not found.'})
        } else {
            return res.status(200).json({'msg': 'Username found.'})
        }
    })
})

app.post('/username', (req, res) => {
    let username = req.body.username
    db.query(`SELECT * from usernames where username='${username}'`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else if (results.length > 0) {
            return res.status(403).json({'error': 'Username has already been used.'})
        } else {
            db.query(`insert into usernames (username) values ('${username}')`)
            return res.status(201).json({'msg': 'Success.'})
        }
    })
})

app.get('/random', (req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})