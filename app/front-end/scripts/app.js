(function (window) {

	"use strict";

	window.app = {};
	window.app.isAngular = true;
	window.ENV = {};

	angular.module('tcr', [

		//app dependencies
		'tcr.models',
		'tcr.modules',
		'tcr.pages',
		'tcr.utils',

		//3rd Party dependencies;
		'ui.router',
		'angularSpinner',
		'ui.bootstrap'
	])

		.config(function (usSpinnerConfigProvider, $httpProvider, $locationProvider) {

			//default Spinner Settings;
			usSpinnerConfigProvider.setDefaults({color: '#ec008c', radius: 10});
			$httpProvider.interceptors.push(function ($q) {
				return {

					'response': function (response) {

						if (angular.isDefined(response.data.status) && response.data.status === "failure") {
							alert(response.data.message);
							return $q.reject(response);
						}

						return $q.when(response);
					}
				};
			});

		})


		//ROUTING

		.config(function ($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.otherwise("/login");

			//ROUTING
			$stateProvider


			//LOGIN PAGE ROUTE
				.state('login', {
					url: '/login',

					views: {
						'container@': {
							templateUrl: 'assets/views/pages/login/main.html',
							controller: 'LoginPageController',
							controllerAs: 'lnPgCtrl'
						}
					}
				});


			// .state('root', {
			// 	url: '',
			// 	abstract: true,
			// 	views: {
			// 		'header': {
			// 			templateUrl: 'assets/views/root/header.html',
			// 			controller: 'RootController'
			// 		},
			// 		'footer': {
			// 			templateUrl: 'assets/views/root/footer.html',
			// 			controller: 'RootController'
			// 		}
			// 	}
			// })


		})


})(window);