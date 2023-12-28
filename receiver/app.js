// const express = require('express');
// const receiverRouter = require('./routes/receiverRouter')
//
// const app = express();
// const PORT = 8000
//
//
// app.use(express.json());
// app.use('/', receiverRouter)
//
// app.listen(PORT, () => console.log('Server running on port 8000'));

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        let q = 'task_queue';

        ch.assertQueue(q, {
            durable: true
        });
        ch.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        ch.consume(q, function reply(msg) {
            let n = parseInt(msg.content.toString());

            console.log(" [.] Received request for %s", n);

            let r = n * 2;

            ch.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

            ch.ack(msg);
        });
    });
});
