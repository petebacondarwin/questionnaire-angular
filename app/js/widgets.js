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
        $(element).mask($scope.uiMask);
        controller.$parsers.push(function(value) {
          var isValid;
          isValid = $(element).data('mask-isvalid');
          controller.$setValidity('mask', isValid);
          return value = isValid ? element.mask() : null;
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
          onClose: function(date, picker) {
            return $scope.$apply(function() {
              return controller.$setViewValue(date);
            });
          }
        };
        angular.extend(options, $scope.uiDate);
        console.log(options);
        return $(element).datepicker(options);
      }
    };
  });

}).call(this);
