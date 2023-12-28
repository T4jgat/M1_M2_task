const amqp = require('amqplib/callback_api')
let correlationId;
let responseQueue = 'response_queue';

class SenderController {
    sendNumber = (req, res) => {
        correlationId = this.generateUuid();

        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                let queue = 'task_queue';
                let msg = req.body.message;

                channel.assertQueue(responseQueue, {
                    exclusive: true
                }, function (error2, q) {
                    if (error2) {
                        throw error2;
                    }

                    channel.consume(q.queue, function (msg) {
                        if (msg.properties.correlationId === correlationId) {
                            console.log(' [.] Got %s', msg.content.toString());
                            res.status(200).send(`Response from M2: ${msg.content.toString()}`);
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, {
                        noAck: true
                    });

                    channel.sendToQueue(queue,
                        Buffer.from(msg.toString()), {
                            correlationId: correlationId,
                            replyTo: q.queue
                        });
                });
            });
        });

}

    generateUuid() {
        return Math.random().toString() +
            Math.random().toString() +
            Math.random().toString();
    }

}

module.exports = new SenderController()