exports.initChat = function (server) {
    const dotenv = require('dotenv');
    var http = require('http');
    var io = require('socket.io')(server);
    
    dotenv.config();
    var redisUrl = 'redis://' + process.env.REDIS_SERVICE_HOST + ':' + process.env.REDIS_SERVICE_PORT;
    var redis = require('redis').createClient(redisUrl);

    var ChatBot = require('./chatBot');
    let chatBot = new ChatBot(io);

    io.sockets.on('connection', function (client) {


        client.on('joinchat', function (data) {
            client.join(data.chat);

            client.nickname = data.name;
            client.chatroom = data.chat;

            redis.lrange('messages-' + client.chatroom, 0, -1, function (err, msgs) {
                msgs = msgs.reverse();
                msgs.forEach(function (m) {
                    client.emit('message', m);
                });
            });
        });

        console.log('user connected');

        client.on('message', function (msg) {

            console.log(redisUrl);

            if (msg == 'error') {
                throw new Error('Yeblys');
            }

            if (msg == 'weather') {
                chatBot.processBotCommand('weather', client, redis);
            }

            var nickname = client.nickname;
            msg = nickname + ': ' + msg;

            redis.lpush('messages-' + client.chatroom, msg, function () {
                redis.ltrim('messages-' + client.chatroom, 0, 9);
            });
            client.broadcast.to(client.chatroom).emit('message', msg);


        });

        client.on('typing', function (username) {
            client.broadcast.to(client.chatroom).emit('typing', username);
        });

        client.on('disconnect', function () {
            console.log(client.nickname + ' disconnected');
        });
    });
};