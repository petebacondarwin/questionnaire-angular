'use strict'

# Declare app-level module which depends on filters, and services
angular.module( 'QuestionnaireApp', ['Controllers', 'ServicesModule', 'WidgetModule'] )
  .config(['$routeProvider', ($routeProvider)->

    $routeProvider.when('/:questionnaire/0',
      redirectTo: '/:questionnaire'
    )    

    $routeProvider.when('/',
      template: 'templates/questionnaire-list.html'
      controller: 'QuestionnaireListController'
    )

    $routeProvider.when('/:questionnaire',
      template: 'templates/questionnaire-detail.html'
    )

    $routeProvider.when('/:questionnaire/summary',
      template: 'templates/questionnaire-summary.html'
      controller: 'SubmissionController'
    )

    $routeProvider.when('/:questionnaire/complete',
      template: 'templates/questionnaire-complete.html'

    )

    $routeProvider.when('/:questionnaire/:questionIndex',
      template: 'templates/question.html'
    )
  ])

