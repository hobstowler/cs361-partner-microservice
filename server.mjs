'use strict'

import 'dotenv/config'
import express, { query } from "express"
import bodyParser from "body-parser";
import {pool} from "./db.mjs";
import fetch from "node-fetch";
import path from "path";

const app = express()
const PORT = process.env.PORT
const db = pool

app.use(express.urlencoded({
    extended: true
}))
app.use(express.static('style'))
app.use(express.static(path.join('./', 'ui', 'build')))
app.use(bodyParser.json())
app.use(express.json())

app.get('/username', (req, res) => {
    let username = req.query.q
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
    fetch('https://api.api-ninjas.com/v1/randomword?type=noun', {
        method: 'GET'
    })
        .then(async response => {
            const hasJson = response.headers.get('content-type')?.includes('application/json')
            const noun = hasJson ? await response.json() : null

            if (!response.ok) {
                let error = (noun && data.error) || response.status
                return Promise.reject(error)
            }
            fetch('https://api.api-ninjas.com/v1/randomword?type=adjective', {
                method: 'GET'
            })
                .then(async response => {
                    const hasJson = response.headers.get('content-type')?.includes('application/json')
                    const adj = hasJson ? await response.json() : null

                    if (!response.ok) {
                        let error = (adj && data.error) || response.status
                        return Promise.reject(error)
                    }
                    let name = `${noun.word}_${adj.word}_${Math.floor(Math.random() * (99999-1) + 1)}`
                    return res.status(200).json({'username': name})
                })
        })
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})