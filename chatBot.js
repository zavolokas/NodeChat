const http = require('http');
const io = require('socket.io');

module.exports = class ChatBot {

    constructor(socketSever){
        this.io = socketSever;
    }

    processBotCommand(cmd, client, redis) {

        if (cmd == 'weather') {
            var options = {
                host: '127.0.0.1',
                port: 5000,
                path: '/weather?city=Amsterdam',
                method: 'GET'
            };

            let io = this.io;

            http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log(chunk);
                    let botmsg = 'bot: ' + chunk;
                    redis.lpush('messages-' + client.chatroom, botmsg, function () {
                        redis.ltrim('messages-' + client.chatroom, 0, 9);
                    });
                    io.in(client.chatroom).emit('message', botmsg);
                });
            }).end();
        }
    }
};