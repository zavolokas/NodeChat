exports.initChat = function (server) {
    var http = require('http');
    var io = require('socket.io')(server);
    var redisUrl = 'redis://' + process.env.REDIS_SERVICE_HOST + ':' +process.env.REDIS_SERVICE_PORT;
    var redis = require('redis').createClient(redisUrl);

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

            if (msg == 'error'){
                throw new Error('Yeblys');
            }

            var employeeUrl = 'http://' + process.env.EMPLOYEE_SVC_SERVICE_HOST;

            if (msg == 'account') {
                var options = {
                    host: employeeUrl,
                    port: process.env.EMPLOYEE_SVC_SERVICE_PORT,
                    path: '/employee',
                    method: 'GET'
                };

                http.request(options, function (res) {
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                    });
                }).end();
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