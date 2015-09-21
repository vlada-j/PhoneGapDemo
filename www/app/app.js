/* *********************************************************************************************** *
 * APPLICATION
 * =============================================================================================== *
 * Description
 * *********************************************************************************************** */
(function() {
'use strict';


angular.module('App', ['ionic'])

.run(function run($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}
	});
})

.config(function config($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('tab', {
			url: '/tab',
			abstract: true,
			templateUrl: 'app/tabs.html'
		})

		.state('tab.barcode', {
			url: '/barcode',
			views: {
				'tab-barcode': {
					templateUrl: 'app/tab-barcode.html',
					controller: 'BarcodeCtrl'
				}
			}
		})

		.state('tab.archive', {
			url: '/archive',
			views: {
				'tab-archive': {
					templateUrl: 'app/tab-archive.html',
					controller: 'ArchiveCtrl'
				}
			}
		})
		.state('tab.archive-detail', {
			url: '/archive/:itemId',
			views: {
				'tab-archive': {
					templateUrl: 'app/item-detail.html',
					controller: 'ItemDetailCtrl'
				}
			}
		})

		.state('tab.account', {
			url: '/account',
			views: {
				'tab-account': {
					templateUrl: 'app/tab-account.html',
					controller: 'AccountCtrl'
				}
			}
		});

	$urlRouterProvider.otherwise('/tab/barcode');

})

.controller('BarcodeCtrl', function($scope, Archive) {
	$scope.text = '';
	$scope.format = '';
	$scope.cancelled = '';
	$scope.msg = '';

	$scope.scan = function() {
		cordova.plugins.barcodeScanner.scan(
			function (result) {
				$scope.text = result.text;
				$scope.format = result.format;
				$scope.cancelled = result.cancelled;

				Archive.add(result);
			},
			function (error) {
				$scope.msg = 'Scanning failed: ' + error;
			}
		);
	};

})

.controller('ArchiveCtrl', function($scope, Archive) {
	$scope.archive = Archive.all();
	$scope.remove = function(item) {
		Archive.remove(item);
	};
})

.controller('ItemDetailCtrl', function($scope, $stateParams, Archive) {
	$scope.item = Archive.get($stateParams.itemId);
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
})

.factory('Archive', function() {
	var archive = [];

	return {
		all: function() {
			return archive;
		},
		add: function(item) {
			archive.push(item);
		},
		remove: function(item) {
			archive.splice(archive.indexOf(item), 1);
		},
		get: function(itemId) {
			for (var i = 0; i < archive.length; i++) {
				if (archive[i].id === parseInt(itemId)) {
					return archive[i];
				}
			}
			return null;
		}
	};
});

})();