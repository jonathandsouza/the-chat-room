(function (global) {

	'use strict';

	angular.module('tcr.utils.underscore', [])

		.provider('_', function () {

			// assumes underscore has already been loaded on the page
			var underscore = global._;

			return {
				_: underscore,
				$get: function () {
					return underscore;
				}
			};
		});

})(window);