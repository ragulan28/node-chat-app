var socket = io();
//var moment = require("./lib/moment");

var locationButton = jQuery('#send-location');

socket.on('connect', function() {
    console.log("Connected to server!!");
});

socket.on('newMessage', function(message) {
    var formatedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime

    });
    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
    //console.log("New Location message", message);
    var formatedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formatedTime

    });
    jQuery('#messages').append(html);
});

socket.on('disconnect', () => {
    console.log("Disconnect from server!!");
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('');
    });
});

locationButton.on('click', function() {
    if (!navigator.geolocation) {
        locationButton.attr('disabled', 'disabled').text('Send Location');
        return alert("Not Supported by browser");
    }
    locationButton.attr('disabled', 'disabled').text('Sending....');
    navigator.geolocation.getCurrentPosition(
        function(position) {
            locationButton.removeAttr('disabled').text('Send Location');

            socket.emit('creteLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        },
        function() {
            locationButton.attr('disabled', 'disabled').text('Send Location');
            alert('Unable to etch location');
        });
});