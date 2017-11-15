var socket = io();
socket.on('connect', () => {
    console.log("Connected to server!!");

    socket.emit('createMessage', {
        from: 'createMessage',
        text: 'New message came'
    });
});

socket.on('newMessage', function(message) {
    console.log("New message", message);
});



socket.on('disconnect', () => {
    console.log("Disconnect from server!!");
});