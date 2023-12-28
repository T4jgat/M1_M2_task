const express = require('express');
const amqp = require('amqplib/callback_api');
const senderRouter = require('./routes/senderRouter')

const app = express();
const PORT = 3000


app.use(express.json());
app.use('/', senderRouter)

app.listen(PORT, () => console.log('Server running on port 3000'));
