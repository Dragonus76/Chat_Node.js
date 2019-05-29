var app = require ('express')(),
var server = require('http').createServer(app),
var io = require('socket.io').listen(server),
var ent = require('ent'), // Permet de bloquer les caractéres HTML (sécurité équivalente à htmlentities en PHP)


// Chargement de la page index.html

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket, pseudo){
    //Dés qu'on nous donne un pseudo, on le stocke en variable de session les autres personnes
    socket.on('nouveau_client', function(pseudo){
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client',pseudo);

    });

    //Dés qu'on recoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes 

    socket.on('message', function(message){

        message = ent.encode(message);
        socket.broadcast('message',{pseudo: socket.pseudo,message:message});

    });
});

server.listen(8080);