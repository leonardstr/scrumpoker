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

$(document).ready(function() {
	
	$('.card-container .card').click(function(e) {
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
			$('.one-card .card').removeClass('back').addClass('front');
		} else {
			$('.one-card .card').addClass('back').removeClass('front');
		}
	});

});
