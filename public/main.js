if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
	  navigator.serviceWorker.register('/sw.js').then(function(registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	  }, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	  });
	});
	}
	
	// Make connection
//var socket2 = io.connect('http://localhost:4000');

$(document).ready(function() {
	
	cardValue = null;
	
	var selectedCard = "";

	$('.card-container .card').click(function(e) {
		selectedCard = $(e.target).data("nr");

		handle = document.getElementById('handle');
		if (!handle.value) 
		{
			alert('Please, select a name to participate.');
			return;
		}
		var message = 'Card selected.';
		if (cardValue) message = 'Card changed.';
		socket.emit('chat', {        message: message,        handle: handle.value    });
		//cardValue = 'card: ' + e.target.innerText;
		cardValue = 'card: ' + $(e.target).data("value");;
		$(".one-card .card p").text(e.target.innerText)
		$('.one-card .card').addClass('back').removeClass('front');

		$('.card-container').hide();
		$('.one-card').show();
	});

	$('#back').click(function() {
		$('.card-container').show();
		$('.one-card').hide();
	});

	$('.one-card .card').click(function() {
		
		if ($('.one-card .card').hasClass('back')) {
			$('.one-card .card').removeClass('back');
			$('.one-card .card').addClass(selectedCard);
		} else {
			$('.one-card .card').addClass('back').removeClass(selectedCard);
		}
		
		handle = document.getElementById('handle');
		socket.emit('chat', {        message: cardValue,        handle: handle.value    });
	});

});
