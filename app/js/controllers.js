(function() {
  'use strict';
  var module;

  module = angular.module('Controllers', []);

  module.controller('AppController', [
    '$scope', 'QuestionnaireService', '$location', '$log', function($scope, QuestionnaireService, $location, $log) {
      var createAnswerHolder, onRouteChanged, updateScopeForQuestionnaire;
      createAnswerHolder = function(questionnaire) {
        var answers;
        $log.log("AppController: Creating a new set of answers for questionnaire: " + questionnaire._id);
        return answers = questionnaire.questions.map(function(question, index) {
          return {
            question: question,
            questionIndex: index + 1,
            isValid: false
          };
        });
      };
      updateScopeForQuestionnaire = function(questionnaire) {
        var _ref, _ref2;
        if (((_ref = $scope.questionnaire) != null ? _ref._id : void 0) !== questionnaire._id) {
          $scope.questionnaire = questionnaire;
          $scope.numQuestions = questionnaire.questions.length;
          $scope.answers = createAnswerHolder(questionnaire);
        }
        $scope.questionnaireUrl = "" + $scope.questionnaireId;
        $scope.home = function() {
          return $location.path('/');
        };
        $scope.start = function() {
          return $location.path("" + $scope.questionnaireUrl + "/1");
        };
        if ($scope.questionIndex != null) {
          if (!(($scope.questionIndex != null) && (1 <= (_ref2 = $scope.questionIndex) && _ref2 <= $scope.numQuestions))) {
            $location.path('/');
          }
          $scope.question = questionnaire.questions[$scope.questionIndex - 1];
          $scope.answer = $scope.answers[$scope.questionIndex - 1];
          $scope.questionTemplate = function(questionType) {
            return "templates/questions/" + questionType + ".html";
          };
          $scope.notFirst = function() {
            return $scope.questionIndex > 1;
          };
          $scope.notLast = function() {
            return $scope.questionIndex < $scope.numQuestions;
          };
          $scope.summary = function() {
            return $location.path($scope.questionnaireUrl + '/summary');
          };
          $scope.first = function() {
            return $location.path($scope.questionnaireUrl);
          };
          $scope.back = function() {
            return $location.path($scope.questionnaireUrl + ("/" + ($scope.questionIndex - 1)));
          };
          $scope.next = function() {
            return $location.path("" + $scope.questionnaireUrl + "/" + ($scope.questionIndex + 1));
          };
          $scope.last = function() {
            return $location.path($scope.questionnaireUrl + ("/" + $scope.numQuestions));
          };
          $scope.showNext = function() {
            return $scope.isValid() && $scope.notLast();
          };
          $scope.isValid = function() {
            var _ref3;
            return (_ref3 = $scope.answer) != null ? _ref3.isValid : void 0;
          };
          $scope.isInvalid = function() {
            return !$scope.isValid();
          };
          return $scope.allValid = function() {
            var _ref3;
            return (_ref3 = $scope.answers) != null ? _ref3.every(function(answer) {
              return answer.isValid;
            }) : void 0;
          };
        }
      };
      onRouteChanged = function() {
        $log.log("Route has changed - getting questionnaire");
        $scope.questionnaireId = QuestionnaireService.currentQuestionnaireId();
        $scope.questionIndex = QuestionnaireService.currentQuestionIndex();
        if ($scope.questionnaireId != null) {
          return QuestionnaireService.getQuestionnaire($scope.questionnaireId).then(function(questionnaire) {
            return updateScopeForQuestionnaire(questionnaire);
          }, function() {});
        }
      };
      return $scope.$on('$afterRouteChange', onRouteChanged);
    }
  ]);

  module.controller('QuestionnaireListController', [
    '$scope', 'QuestionnaireService', '$log', function($scope, QuestionnaireService, $log) {
      return QuestionnaireService.list().then(function(questionnaires) {
        return $scope.questionnaires = questionnaires;
      });
    }
  ]);

  module.controller('IdentityQuestionController', [
    '$scope', function($scope) {
      $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:-0'
      };
      $scope.$watch((function() {
        return "" + $scope.identityForm.$valid;
      }), function(value) {
        var answer;
        answer = $scope.answer;
        answer.value = hex_md5(answer.nhs + ":" + $scope.niceDate(answer.dob));
        return answer.isValid = $scope.identityForm.$valid;
      });
      $scope.niceDate = function(date) {
        var dateString;
        return dateString = $scope.$eval('answer.dob | date : "dd MMM yyyy"');
      };
      return $scope.$watch((function() {
        return "" + $scope.answer.nhs + " : " + $scope.answer.dob;
      }), function(value) {
        return $scope.answer.description = "NHS: " + $scope.answer.nhs + " <br/>DoB: " + ($scope.niceDate($scope.answer.dob));
      });
    }
  ]);

  module.controller('ChoiceQuestionController', [
    '$scope', function($scope) {
      $scope.choiceCSSClass = function(choice) {
        var _ref;
        if (((_ref = $scope.answer) != null ? _ref.choice : void 0) === choice) {
          return 'blue';
        } else {
          return 'white';
        }
      };
      return $scope.selectChoice = function(choice) {
        return angular.extend($scope.answer, {
          choice: choice,
          isValid: choice != null,
          description: choice.title,
          value: choice.value
        });
      };
    }
  ]);

  module.controller('SubmissionController', [
    '$scope', '$location', 'ResponseService', function($scope, $location, ResponseService) {
      return $scope.submit = function() {
        ResponseService.submitResponse($scope.questionnaire, $scope.answers);
        return $location.path($scope.questionnaireUrl + "/complete");
      };
    }
  ]);

}).call(this);
