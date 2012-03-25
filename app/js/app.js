(function() {
  'use strict';
  angular.module('AppConfig', []).config([
    '$routeProvider', function($routeProvider) {
      $routeProvider.when('/:questionnaire/0', {
        redirectTo: '/:questionnaire'
      });
      $routeProvider.when('/', {
        template: '/templates/questionnaire-list.html',
        controller: 'Questionnaire.QuestionnaireListController'
      });
      $routeProvider.when('/:questionnaire', {
        template: '/templates/questionnaire-detail.html',
        controller: 'Questionnaire.QuestionnaireController'
      });
      $routeProvider.when('/:questionnaire/summary', {
        template: '/templates/questionnaire-summary.html',
        controller: 'Questionnaire.QuestionnaireController'
      });
      return $routeProvider.when('/:questionnaire/:questionIndex', {
        template: '/templates/question.html',
        controller: 'Questionnaire.QuestionController'
      });
    }
  ]);

}).call(this);
