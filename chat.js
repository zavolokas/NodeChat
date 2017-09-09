exports.initChat = function (server) {
    var io = require('socket.io')(server);
    var redis = require('redis').createClient();

    io.sockets.on('connection', function (client) {
        redis.lrange('messages', 0, -1, function (err, msgs) {
            msgs = msgs.reverse();
            msgs.forEach(function (m) {
                client.emit('message', m);
            });
        });

        client.on('join', function(name){
            client.nickname = name;
        });

        console.log('user connected');

        client.on('message', function (msg) {

            var nickname = client.nickname;
            msg = nickname + ': ' + msg;

            redis.lpush('messages', msg, function () {
                redis.ltrim('messages', 0, 3);
            });

            console.log('user said: ' + msg);
            client.broadcast.emit('message', msg);
            //client.emit('message', msg);
        });

        client.on('typing', function (username) {
            client.broadcast.emit('typing', username);
        });

        client.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
};