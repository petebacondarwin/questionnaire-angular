'use strict'

# ui:masked
# a directive for a text element to obtain masked-field editing capabilities
Widgets = angular.module('WidgetModule', [])

Widgets.directive 'uiMasked', ['$parse',($parse)->
  replace: true
  template: "<input type='text'></input>"
  link: ($scope, el, attrs)->
    valueExp = $parse(attrs.uiValue)
    isValidExp = $parse(attrs.uiIsvalid)
    maskExp = $parse(attrs.uiMask)
    onChange = ()->
      valid = el.isMaskValid()
      if valid
          el.addClass('mask-valid').removeClass('mask-invalid')
      else
          el.addClass('mask-invalid').removeClass('mask-valid')
      valueExp.assign($scope, el.mask())
      isValidExp.assign($scope, valid)
      $scope.$digest()

    $(el).mask(maskExp($scope))
    el.keypress(onChange).keydown(onChange)
]

Widgets.directive 'uiDate', ['$parse',($parse)->
  replace: true
  template: "<input type='text'></input>"
  link: ($scope, el, attrs)->
    isValidExp = $parse(attrs.uiIsvalid) if attrs.uiIsvalid?
    modelExp = $parse(attrs.ngModel)
    $(el).datepicker
      changeMonth: true
      changeYear: true
      dateFormat: 'dd/mm/yy'

      onClose: (date, picker)=>
        modelExp.assign($scope, date)
        isDate = /\d\d\/\d\d\/\d\d\d\d/.test(date)
        isValidExp?.assign($scope, isDate)
        $scope.$digest()
]