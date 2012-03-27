'use strict'

# ui:masked
# a directive for a text element to obtain masked-field editing capabilities
Widgets = angular.module('WidgetModule', [])

Widgets.directive 'uiMask', ()->
  require: 'ngModel'
  scope:
    uiMask: 'evaluate'
  link: ($scope, element, attrs, controller)->
    $(element).mask($scope.uiMask)

    # Add a parser that only allows the model value through if the mask is valid
    controller.$parsers.push (value)->
      isValid = $(element).data('mask-isvalid')
      controller.$setValidity('mask', isValid)
      value = if isValid then element.mask() else null

    # When the element blurs, update the viewvalue
    $(element).bind 'blur', ()->
      $scope.$apply ()->
        controller.$setViewValue(element.mask())

Widgets.directive 'uiDate', ()->
  require: 'ngModel'
  scope:
    uiDate: 'evaluate'
  link: ($scope, element, attrs, controller)->
    options = 
      onClose: (date, picker)->
        $scope.$apply ()->
          controller.$setViewValue(date)
    angular.extend options, $scope.uiDate

    console.log options
    $(element).datepicker options
