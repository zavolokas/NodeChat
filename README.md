# NodeChat
Simple web chat application on Node.js that utilizes:
-  [Express](http://expressjs.com/)
-  [REDIS](https://redis.io/)
-  [Socket.io](https://socket.io/)
-  [Vue.js](https://vuejs.org/)

## How to run
Navigate to the root foldet and run 
```
> node bin/www
```
The app is available at the [localhost](http://localhost:3000) on port 3000.

What you will see are two text boxes and a *join* button. In the first text box provide the any chat room name you would like to join to. In the second one, provide your nickname. After you've joined you can start to chat!

## Docker
To run the app in Docker, navigate to the root folder and execute:
```
docker-compose up
```
The app should be available at the [localhost](http://localhost:3000) on port 4000.