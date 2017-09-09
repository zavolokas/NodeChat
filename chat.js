exports.initChat = function (server) {
    var io = require('socket.io')(server);
    var redis = require('redis').createClient();

    io.sockets.on('connection', function (client) {
        redis.lrange('messages', 0, -1, function (err, msgs) {
            msgs = msgs.reverse();
            msgs.forEach(function (m) {
                client.to(client.room).emit('message', m);
            });
        });

        client.on('join', function(data){
            console.log(data);
            client.nickname = data.name;
            client.room = data.chat;
            client.join(data.chat);
        });

        console.log('user connected');

        client.on('message', function (msg) {

            var nickname = client.nickname;
            msg = nickname + ': ' + msg;

            redis.lpush('messages', msg, function () {
                redis.ltrim('messages', 0, 3);
            });

            console.log('user said: ' + msg);
            client.to(client.room).broadcast.emit('message', msg);
            //client.emit('message', msg);
        });

        client.on('typing', function (username) {
            client.to(client.room).broadcast.emit('typing', username);
        });

        client.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
};