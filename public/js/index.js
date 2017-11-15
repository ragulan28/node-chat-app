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

socket.on('newLocationMessage', function(message) {
    console.log("New Location message", message);
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>')
    li.text(`${message.from}: `);
    a.attr('href', message.url)
    li.append(a);
    jQuery('#messages').append(li);
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