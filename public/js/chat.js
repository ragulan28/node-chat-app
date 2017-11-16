var socket = io();
//var moment = require("./lib/moment");


function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // console.log("should Scroll");
        messages.scrollTop(scrollHeight);
    }
}

var locationButton = jQuery('#send-location');

socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log("No Error");
        }
    });
});

socket.on('updateUserList', function(users) {
    console.log("User list", users);
    var ol = jQuery('<ol></ol>')
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);

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
    scrollToBottom();
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
    scrollToBottom();
});

socket.on('disconnect', () => {
    console.log("Disconnect from server!!");
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
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