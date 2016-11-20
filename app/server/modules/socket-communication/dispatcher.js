/**
 * Created by Jonathan on 19-11-2016.
 */

'use strict';

module.exports = function (overrides) {

	//UTILITIES
	var _ = require('lodash');

	//DEFAULTS
	var _defaults = {
		config: require('../../config'),
		queueManager: eventQueueManager()
	};

	//OVERRIDES
	var _options = _.extend({}, _defaults, overrides || {});

	var _config = _options.config;
	var _queueManager = _options.queueManager;


	//DISPATCHER INSTANCE
	var dispatcher = {};

	//PUBLIC METHODS

	//MODULE INITIALIZATION
	dispatcher.init = function () {
		Object.keys(_config.EVENTS).forEach(function (eventGroup) {
			_queueManager.addEvents(_config.EVENTS[eventGroup]);
		});
	};

	//REGISTER EVENTS
	dispatcher.register = function (event, callback) {
		_queueManager.register(event, callback);
	};

	//TRIGGER EVENTS
	dispatcher.trigger = function (event, transmission) {
		_queueManager.trigger(event, transmission);

	};


	return dispatcher;
};


//MAINTAIN OF EVENTS & CALLBACKS
var eventQueueManager = function () {

	//EVENT QUEUE :  used to maintain event queue
	var eventQueue = {};

	//PRIVATE METHODS & OBJECTS
	var _internal = {};

	_internal.addEvent = function (event) {
		//REGISTER EVENT
		eventQueue[event] = (eventQueue[event] || []);
	};

	var factObj = {};

	//PUBLIC METHODS

	//ADD EVENTS
	factObj.addEvents = function (config) {
		Object.keys(config).forEach(function (evt) {
			_internal.addEvent(evt);
		});
	};

	//REGISTER CALLBACKS TO EVENTS
	factObj.register = function (event, callback) {

		_internal.addEvent(event);

		eventQueue[event].push(callback);
	};

	//TRIGGER EVENT
	factObj.trigger = function (event, transmission) {

		eventQueue[event].forEach(function (callback) {
			callback(transmission);
		});

	};


	return factObj;
};