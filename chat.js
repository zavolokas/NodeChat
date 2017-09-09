exports.initChat = function (server) {
    var io = require('socket.io')(server);
    var redis = require('redis').createClient();

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