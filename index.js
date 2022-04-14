// const https = require("https")
const express = require("express")
const fs = require('fs')
// const crypto = require('crypto')
const line = require('@line/bot-sdk')
const cors = require("cors");
// const app = express()
// const PORT = process.env.PORT || 3000

let text = fs.readFileSync("./token.txt", 'utf8')
let lines = text.toString()
const TOKEN = lines
text = fs.readFileSync("./secret.txt", 'utf8')
lines = text.toString()
const SECRET = lines

const config = {
    channelAccessToken: TOKEN,
    channelSecret: SECRET
}

const client = new line.Client(config)

const app = express()
app.use(cors())

app.post('/test', (req, res) => {
    res.send('POST sent.')
})

app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.err(err)
            res.status(500).end()
        })
})

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(200)
    }
    const echo = {
        type: 'text',
        text: `${event.message.text}\nなにかお手伝いできることはありますか？`

    }
    const lonely = {
        type: 'text',
        text: 'ええ、私もたまに寂しくなることがあります。'
    }
    const love = {
        type: 'text',
        text: 'すきだよ。'
    }
    const yoshiyoshi = {
        type: 'text',
        text: 'よしよし〜'
    }

    let msg = event.message.text
    if (msg.includes('寂しい')){
        return client.replyMessage(event.replyToken, lonely)
    }
    if (msg.includes('好き') || msg.includes('すき')) {
        return client.replyMessage(event.replyToken, love)
    }
    if (msg.includes('構って') || msg.includes('かまって')) {
        return client.replyMessage(event.replyToken, yoshiyoshi)
    }
    switch (msg){
        case 'さびしい':
            return client.replyMessage(event.replyToken, lonely)
            break
        case 'さみしい':
            return client.replyMessage(event.replyToken, lonely)
            break
    }
    return client.replyMessage(event.replyToken, echo)
}

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
