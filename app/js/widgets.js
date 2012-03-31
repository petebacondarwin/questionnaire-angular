(function() {
  'use strict';
  var Widgets;

  Widgets = angular.module('WidgetModule', []);

  Widgets.directive('uiMask', function() {
    return {
      require: 'ngModel',
      scope: {
        uiMask: 'evaluate'
      },
      link: function($scope, element, attrs, controller) {
        var defaultRender;
        defaultRender = controller.$render;
        controller.$render = function() {
          defaultRender();
          return $(element).mask($scope.uiMask);
        };
        controller.$parsers.push(function(value) {
          var isValid;
          isValid = $(element).data('mask-isvalid');
          controller.$setValidity('mask', isValid);
          if (isValid) {
            return element.mask();
          } else {
            return null;
          }
        });
        return $(element).bind('blur', function() {
          return $scope.$apply(function() {
            return controller.$setViewValue(element.mask());
          });
        });
      }
    };
  });

  Widgets.directive('uiDate', function() {
    return {
      require: '?ngModel',
      scope: {
        uiDate: 'evaluate'
      },
      link: function($scope, element, attrs, controller) {
        var originalRender, updateModel, usersOnSelectHandler;
        if ($scope.uiDate == null) $scope.uiDate = {};
        if (controller != null) {
          updateModel = function(value, picker) {
            return $scope.$apply(function() {
              return controller.$setViewValue(element.datepicker("getDate"));
            });
          };
          if ($scope.uiDate.onSelect != null) {
            usersOnSelectHandler = $scope.uiDate.onSelect;
            $scope.uiDate.onSelect = function(value, picker) {
              updateModel(value);
              return usersOnSelectHandler(value, picker);
            };
          } else {
            $scope.uiDate.onSelect = updateModel;
          }
          originalRender = controller.$render;
          controller.$render = function() {
            originalRender();
            return element.datepicker("setDate", controller.$viewValue);
          };
        }
        return element.datepicker($scope.uiDate);
      }
    };
  });

}).call(this);
