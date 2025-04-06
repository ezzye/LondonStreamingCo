const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const app = next({ dev: false })
const handle = app.getRequestHandler()

exports.handler = async (event, context) => {
    const request = {
        method: event.httpMethod,
        headers: event.headers,
        url: event.path + (event.queryStringParameters ? '?' + new URLSearchParams(event.queryStringParameters).toString() : ''),
        body: event.body
    }
    
    const response = await new Promise((resolve) => {
        const server = createServer((req, res) => {
            handle(req, res).then(() => {
                const chunks = []
                res.write = (chunk) => {
                    chunks.push(chunk)
                    return true
                }
                res.end = () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.getHeaders(),
                        body: Buffer.concat(chunks).toString('utf8')
                    })
                }
            })
        })
        server.emit('request', request, response)
    })
    
    return response
} 