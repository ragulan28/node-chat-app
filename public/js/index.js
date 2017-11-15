var socket = io();
var locationButton = jQuery('#send-location');

socket.on('connect', function() {
    console.log("Connected to server!!");
});

socket.on('newMessage', function(message) {
    console.log("New message", message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} : ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('disconnect', () => {
    console.log("Disconnect from server!!");
});

// socket.emit('createMessage', {
//     from: 'ranjana',
//     text: 'Hi'
// }, function(data) {
//     console.log('Got it', data);
// });

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function() {

    });
});

locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert("Not Supported by browser");
    }
    navigator.geolocation.getCurrentPosition(
        function(position) {
            socket.emit('creteLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        },
        function() {
            alert('Unable to etch location');
        });
});