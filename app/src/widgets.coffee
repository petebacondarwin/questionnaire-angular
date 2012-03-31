'use strict'

# Masked input field directive
# Requires JQuery masked input plugin from twarogowski
Widgets = angular.module('WidgetModule', [])

Widgets.directive 'uiMask', ()->
  require: 'ngModel'
  scope:
    uiMask: 'evaluate'
  link: ($scope, element, attrs, controller)->

    # We override the render method to run the jQuery mask plugin
    defaultRender = controller.$render
    controller.$render = ()->
      defaultRender()
      $(element).mask($scope.uiMask)

    # Add a parser that extracts the masked value into the model but only if the mask is valid
    controller.$parsers.push (value)->
      isValid = $(element).data('mask-isvalid')
      controller.$setValidity('mask', isValid)
      if isValid
        element.mask()
      else
        null

    # When the element blurs, update the viewvalue
    $(element).bind 'blur', ()->
      $scope.$apply ()->
        controller.$setViewValue(element.mask())


Widgets.directive 'uiDate', ()->
  require: '?ngModel'
  scope:
    uiDate: 'evaluate'
  link: ($scope, element, attrs, controller)->
    $scope.uiDate ?= {}

    # If we have a controller (i.e. ngModelController) then wire it up
    if controller?
      updateModel = (value, picker)->
        $scope.$apply ()->
          controller.$setViewValue(element.datepicker("getDate"))

      if $scope.uiDate.onSelect?
        # Caller has specified onSelect to call this as well as updating the model
        usersOnSelectHandler = $scope.uiDate.onSelect
        $scope.uiDate.onSelect = (value, picker)->
          updateModel(value)
          usersOnSelectHandler(value, picker)
      else
        # No onSelect already specified so just update the model
        $scope.uiDate.onSelect = updateModel

      # Update the date picker when the model changes
      originalRender = controller.$render
      controller.$render = ()->
        originalRender()
        element.datepicker("setDate", controller.$viewValue)

    # Create the datepicker widget
    element.datepicker($scope.uiDate)

