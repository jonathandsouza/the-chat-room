/**
 * Created by Jonathan on 19-11-2016.
 */

'use strict';

angular.module('chat', [])

	.constant('EVENTS', {

		CONNECTION: {

			CONNECT: 'connection',

			DISCONNECT: 'disconnect',
		},

		USER: {

			INIT: 'uer initialize'
		},

		CHAT: {

			SEND: 'CHAT SEND',

			RECEIVE: 'CHAT RECEIVE',

			TYPING: 'CHAT TYPING'


		}

	})

	.controller('MainController', ['$scope', 'io', 'EVENTS', function ($scope, io, EVENTS) {

		// var self = this;
		//
		// io.emit(EVENTS.USER.INIT, {id: 123});
		//
		// self.trigger = function () {
		// 	io.emit(self.event, JSON.parse(self.json));
		// }


	}])

	.factory('io', function () {

		window.socket = io();


		return socket;

	});
