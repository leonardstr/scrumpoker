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

var socket = io.connect('http://localhost:4000/');

var Main = (function ($, labels) {

	var priv = {
		name: '',
		team: '',

		getTeamAndName: function () {
			priv.name = localStorage.getItem('name');
			if (priv.name) {
				$('#name').val(priv.name);
			}
			priv.team = localStorage.getItem('team');
			if (priv.team) {
				$('#team').val(priv.team);
			}
		}
	};
	return {

		init: function () {

			socket.on('chat', function(data){ 
				if (data.team == priv.team) {
					if (data.type == 'join') {
						console.log(data.type + ' name: ' + data.name);
						Main.join(data.name);
					}
					if (data.type == 'disconnect') {
						console.log(data.type + ' name: ' + data.name);
						Main.disconnect(data.name);
					}
					if (data.type == 'selectcard') {
						console.log(data.type + ' name: ' + data.name + ' card: ' + data.card);
						Main.selectcard(data.name, data.card);
					}
					if (data.type == 'show') {
						console.log(data.type + ': ');
						Main.show();
					}
					if (data.type == 'new') {
						console.log(data.type + ': ');
						Main.new();
					}
				}
			});
			$(window).bind('beforeunload', function(){
				socket.emit('chat', {
					type: 'disconnect',
					team: priv.team,
					name: priv.name
				});
			});		

			priv.getTeamAndName();

			$('#team').change(function() {
				localStorage.setItem('team', $('#team').val());
			});
		
			$('#join').click(function() {
				priv.team = $('#team').val();
				if (!priv.team || priv.team =='Select a team') {
					$('#team').focus();
					alert('please select a team');
					return false;
				}

				priv.name = $('#name').val();
				if (!priv.name) {
					$('#name').focus();
					alert('please enter a name');
					return false;
				}
				localStorage.setItem('name', priv.name);

				socket.emit('chat', {
					type: 'join',
					team: priv.team,
					name: priv.name
				});

				$('.message-container').hide();
				$('.message-container.wait4teammembers').show();
			});

			$('.hand-container .card').click(function(e) {
				if (!priv.team || priv.team =='Select a team') {
					$('#team').focus();
					alert('please select a team');
					return false;
				}
				if (!priv.name) {
					$('#name').focus();
					alert('please enter a name');
					return false;
				}
				if ($('.message-container.name:visible').length == 1) {
					alert('please join first');
					return false;
				}

				var card = $(e.target).data('nr');
				socket.emit('chat', {
					type: 'selectcard',
					team: priv.team,
					name: priv.name,
					card: card
				});

				if ($('.cardempty:visible').length != 0) {
					$('.message-container').hide();
					$('.message-container.wait4votes').show();
				}
				
			});

			$('#showcards').click(function() {
				socket.emit('chat', {
					team: priv.team,
					type: 'show'
				});	
			});

			$('#new').click(function() {
				socket.emit('chat', {
					team: priv.team,
					type: 'new'
				});	
			});			
		},

		join: function (name) {
			var exist = $('.card-holder').filter('[data-name=' + name + ']').length;
			if (!exist) {
				var template = $('.table-container .template.hidden').clone();
				$('.name', template).text(name);
				$('.table-container').append(template.attr('data-name', name).removeClass('hidden'));	

				socket.emit('chat', {
					type: 'join',
					team: priv.team,
					name: priv.name
				});				
			}
		},

		disconnect: function (name) {
			var exist = $('.card-holder').filter('[data-name=' + name + ']').length;
			if (exist) {
				$('.card-holder').filter('[data-name=' + name + ']').remove();
			}
		},

		selectcard: function (name, card) {
			var el = $( ".table-container .template" ).filter('[data-name=' + name + ']');

			var back = $('.card', el).hasClass('cardback');
			var empty = $('.card', el).hasClass('cardempty');
			
			if (back || empty) {
				// show back
				$('.card', el).removeClass().addClass('card').addClass('cardback').addClass(card);

				if ($('.cardempty:visible').length == 0) {
					$('.message-container').hide();
					$('.message-container.showcards').show();
				}

			} else {
				// show cardback briefly (animation), and then show value
				$('.card', el).removeClass().addClass('card').addClass('cardback').addClass(card);
				setTimeout(function(){
					$('.card', el).removeClass('cardback');
				}, 200);
			}
		},
		show: function () {
			$('.cardback').removeClass('cardback');
			$('.message-container').hide();
			$('.message-container.shownew').show();
		},
		new: function () {
			$('.message-container').hide();
			$('.message-container.selectcard').show();
			$('.table-container .template .card').removeClass().addClass('card').addClass('cardempty');
		}
	}
}(jQuery));

$(document).ready(function() {
 	Main.init();
});
