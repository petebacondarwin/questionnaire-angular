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
        controller.$render = function() {
          var _ref;
          element.val((_ref = controller.$viewValue) != null ? _ref : '');
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
      require: 'ngModel',
      scope: {
        uiDate: 'evaluate'
      },
      link: function($scope, element, attrs, controller) {
        var options;
        options = {
          onSelect: function(date, picker) {
            return $scope.$apply(function() {
              console.log(date);
              return controller.$setViewValue(date);
            });
          }
        };
        angular.extend(options, $scope.uiDate);
        return controller.$render = function() {
          var _ref;
          element.val((_ref = controller.$viewValue) != null ? _ref : '');
          return $(element).datepicker(options);
        };
      }
    };
  });

}).call(this);
