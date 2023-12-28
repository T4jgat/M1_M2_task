const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err0, connection) => {
    if (err0) {
        throw err0
    }

    connection.createChannel((err1, channel) => {
        if (err1) {
            throw err1
        }
        let queue = 'dev-queue'

        channel.assertQueue(queue, {
            durable: false
        })

        console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue)
        channel.consume(queue, (msg) => {
            console.log("[x] Received %s", msg.content.toString())
        }, {
            noAck: true
        })
    })
})