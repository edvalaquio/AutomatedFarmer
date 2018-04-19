'use strict';

var modalModule = angular.module("controllers.modalController", [])
modalModule.controller('modalController', function ($uibModal, $log, $document) {
	var $ctrl = this;
	$ctrl.animationsEnabled = true;

	$ctrl.open = function (template, data) {
		$ctrl.data = data;
		var modalInstance = $uibModal.open({
			animation: $ctrl.animationsEnabled,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: '/partials/' + template + '.html',
			controller: 'modalInstanceController',
			controllerAs: '$ctrl',
			size: 'md',
			appendTo: undefined,
			resolve: {
				items: function () {
					return $ctrl.data;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$ctrl.selected = selectedItem;
		}, function () {
			return;
		});
	};

	$ctrl.toggleAnimation = function () {
		$ctrl.animationsEnabled = !$ctrl.animationsEnabled;
	};
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
modalModule.controller('modalInstanceController', function ($uibModalInstance, items) {
	var $ctrl = this;
	$ctrl.items = items;

	$ctrl.ok = function () {
		$uibModalInstance.close();
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});