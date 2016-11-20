/**
 * Created by Jonathan on 19-11-2016.
 */


'use strict';

//APP BOOTSTRAPING
module.exports = function (options) {

	//UTILITIES
	var _ = require('lodash');

	//DEFAULTS
	var _defaults = {};

	//OVERRIDES
	options = _.extend({}, _defaults, options);

	//PRIVATE VARIABLES
	var _io = options.io;


	return {
		init() {

			//BOOTSTRAP SOCKET COMMUNICATION MODULE
			var socketCommunication = require('./modules/socket-communication/core')(_io, {
				config: require('./config')
			});

			//INITIALIZE SOCKET COMMUNICATION MODULE
			socketCommunication.init();

			//BOOTSTRAP CHAT MODULE
			var chatManager = require('./modules/chat-manager/core')({
				config: require('./config'),
				socketCommunication
			});

			//INIT CHAT MODULE
			chatManager.init();


		}
	};


};