/**
 * Created by Jonathan on 18-11-2016.
 */

'use strict';


module.exports = function (options) {

	//UTILITY
	var _ = require('lodash');

	//DEFAULTS
	var _defaults = {
		config: require('../../config')
	};

	//OVERRIDES
	options = _.extend({}, _defaults, options);

	//PRIVATE VARIABLES
	var _socketComm = options.socketCommunication;
	var _config = options.config;


	//INTERNAL METHOD TRIGGERS
	var _internal = {

		sendMessage: function (transmission) {

			_socketComm.transmitter(_config.EVENTS.CHAT.RECEIVE, {
				to: transmission.meta.to,
				from: transmission.meta.from
			}, {
				message: transmission.message,
			});
		},

		typing: function (transmission) {

			_socketComm.transmitter(_config.EVENTS.CHAT.RECEIVE, {
				to: transmission.meta.to,
				from: transmission.meta.from
			}, {
				user: transmission.meta.from,
			});

		},

		userJoined: function (transmission) {

			_socketComm.broadcast(_config.EVENTS.CHAT.USER_JOINED, {
				to: transmission.meta.to,
				from: transmission.meta.from
			}, {
				user: transmission.meta.from,
			});

		},

		userLeft: function (transmission) {

			_socketComm.broadcast(_config.EVENTS.CHAT.USER_LEFT, {
				to: transmission.meta.to,
				from: transmission.meta.from
			}, {
				user: transmission.meta.from,
			});

		}
	};

	return {
		init() {

			_socketComm.receiver(_config.EVENTS.CHAT.SEND, _internal.sendMessage);
			_socketComm.receiver(_config.EVENTS.CHAT.TYPING, _internal.typing);
			_socketComm.receiver(_config.EVENTS.CHAT.USER_JOINED, _internal.userJoined);
			_socketComm.receiver(_config.EVENTS.CHAT.USER_LEFT, _internal.userLeft);

		}
	};


};