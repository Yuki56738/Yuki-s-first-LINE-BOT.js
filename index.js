// const https = require("https")
const express = require("express")
const fs = require('fs')
// const crypto = require('crypto')
const line = require('@line/bot-sdk')
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
        text: event.message.text

    }
    return client.replyMessage(event.replyToken, echo)
}

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
//
// app.use(express.json())
// app.use(express.urlencoded({
//     extended: true
// }))
//
// app.get("/", (req, res) => {
//     res.sendStatus(200)
// })
//
// app.post("/test", (req, res) => {
//     res.send("POST received.")
// })
//
// function checkSign(body){
//     const signature = crypto
//         .createHmac('SHA256', SECRET)
//         .update(Buffer.from(JSON.stringify(body))).digest('base64')
// }
// app.post("/webhook", function(req, res) {
//     res.send("HTTP POST request received.")
//     // console.dir(req.headers["x-line-signature"], { depth: null })
//     const body = req.body
//
//     // console.log(signature)
//     if (req.headers["x-line-signature"] !== signature) {
//         return 1
//     }
//     if (req.body.events[0].type === "message") {
//         const dataString = JSON.stringify({
//             replyToken: req.body.events[0].replyToken,
//             messages: [
//                 {
//                     "type": "text",
//                     "text": "こんにちは〜"
//                 },
//                 // {
//                 //     "type": "text",
//                 //     "text": "May I help you?"
//                 // }
//             ]
//         })
//
//         const headers = {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + TOKEN
//         }
//
//         const webhookOptions = {
//             "hostname": "api.line.me",
//             "path": "/v2/bot/message/reply",
//             "method": "POST",
//             "headers": headers,
//             "body": dataString
//         }
//
//         const request = https.request(webhookOptions, (res) => {
//             res.on("data", (d) => {
//                 process.stdout.write(d)
//             })
//         })
//
//         request.on("error", (err) => {
//             console.error(err)
//         })
//
//         request.write(dataString)
//         request.end()
//     }
// })
//
// app.listen(PORT, () => {
//     console.log(`Listening on ${PORT}`)
// })