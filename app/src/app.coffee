'use strict'

angular.module('AppConfig',[])
  .config(['$routeProvider', ($routeProvider)->

    $routeProvider.when('/:questionnaire/0',
      redirectTo: '/:questionnaire'
    )    

    $routeProvider.when('/',
      template: '/templates/questionnaire-list.html'
      controller: 'Questionnaire.QuestionnaireListController'
    )

    $routeProvider.when('/:questionnaire',
      template: '/templates/questionnaire-detail.html'
    )

    $routeProvider.when('/:questionnaire/summary',
      template: '/templates/questionnaire-summary.html'
      controller: 'Questionnaire.SubmissionController'
    )

    $routeProvider.when('/:questionnaire/:questionIndex',
      template: '/templates/question.html'
    )
  ])
