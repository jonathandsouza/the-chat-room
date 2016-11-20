'use strict';

module.exports = function (io, overrides) {

	//UTILITIES
	var _ = require('lodash');

	//DEFAULTS
	var _defaults = {
		userManager: require('./user-manager')(),
		dispatcher: require('./dispatcher')({
			config: require('../../config')
		}),
		config: require('../../config')
	};

	//OVERRIDES
	var options = _.extend({}, _defaults, overrides || {});

	//PRIVATE INSTANCES
	var _userManger = options.userManager;
	var _dispatcher = options.dispatcher;
	var _config = options.config;
	var _decorators = {};

	//INITIALIZE DISPATCHER 
	_dispatcher.init();

	//INITIALIZE DECORATORS
	_decorators = {

		//OUTPUT PAYLOAD DECORATOR
		payloadDecorator(event, meta, payload) {

			return _.extend({
				meta: {
					event: event,
					from: meta.from,
					to: meta.to
				}
			}, payload);
		},

		//SOCKET EVENT ENGINE DECORATOR 
		socketDecorator(socket) {

			Object.keys(_config.EVENTS).forEach(function (eventGroup) {

				Object.keys(_config.EVENTS[eventGroup]).forEach(function (event) {

					socket.on(_config.EVENTS[eventGroup][event], function (transmission) {
						console.log('EVENT TRIGGERED', event, transmission);
						_dispatcher.trigger(_config.EVENTS.CHAT.SEND, transmission);
					});

				});

			});
		}
	};


	//COMMUNICATION CORE 
	var communicationMod = {};

	//INITIALIZE MODULE
	communicationMod.init = function () {

		//SOCKET IO CONFIG 
		io.on(_config.EVENTS.CONNECTION.CONNECT, function (socket) {

			console.log('CONNECTION INITIATED', socket.id);

			// INITIAL USER INITIALIZATION 
			socket.on(_config.EVENTS.USER.INIT, function (transmission) {

				//REGISTER USER 
				_userManger.register(transmission, socket);

				console.log('USER CONNECTED:::', transmission);

				// EVENT ENGINE DECORATOR 
				_decorators.socketDecorator(socket);

			});


			//USER DISCONNECTION
			socket.on(_config.EVENTS.CONNECTION.DISCONNECT, function () {

				//REMOVE USER FROM REGISTRY
				_userManger.removeUser(socket.id);
				console.log('USER DISCONNECTED', socket.id);

			});

		});
	};


	// PUBLIC METHODS 

	//TRANSMIT EVENT 
	communicationMod.transmitter = function (event, meta, payload) {

		var user = _userManger.getUser(meta.to);

		if (user) {
			user.socket.emit(event, _decorators.payloadDecorator(event, meta, payload));
			return true;
		}
		else {
			return false;
		}

	};

	//RECEIVES EVENTS
	communicationMod.receiver = function (event, callback) {

		_dispatcher.register(event, callback);

	};

	//BROADCAST EVENT OVER CONTACT LIST 
	communicationMod.broadcast = function (event, meta, payload) {

		var user = _userManger.getUser(meta.from);

		(user.contactList || []).forEach(function (contact) {

			communicationMod.transmitter(event, _.extend({}, meta, {to: contact}, payload));

		});
	};

	return communicationMod;

};