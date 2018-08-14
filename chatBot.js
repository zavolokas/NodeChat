const http = require('http');
const io = require('socket.io');

module.exports = class ChatBot {

    constructor(socketSever) {
        this.io = socketSever;
    }

    processBotCommand(cmd, client, redis) {

        let options = null;

        if (cmd == 'weather') {
            let serviceHost = process.env.WEATHER_SERVICE_HOST || 'localhost';
            let servicePort = process.env.WEATHER_SERVICE_PORT || 80;
            options = {
                host: serviceHost,
                port: servicePort,
                path: '/weather?city=Amsterdam',
                method: 'GET'
            };
        }

        let io = this.io;

        let request = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log(chunk);
                let botmsg = 'bot: ' + chunk;
                redis.lpush('messages-' + client.chatroom, botmsg, function () {
                    redis.ltrim('messages-' + client.chatroom, 0, 9);
                });
                io.in(client.chatroom).emit('message', botmsg);
            });

            res.on('error', function (e) {
                console.log(e);
            });
        });

        request.on('error', function (e) {
            console.log(e);
        });

        request.end();
    }
};