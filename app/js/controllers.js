(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.Questionnaire == null) this.Questionnaire = {};

  this.Questionnaire.QuestionnaireListController = (function() {

    QuestionnaireListController.$inject = ['$scope', 'QuestionnaireService', '$log'];

    function QuestionnaireListController($scope, QuestionnaireService, $log) {
      var _this = this;
      this.$scope = $scope;
      this.QuestionnaireService = QuestionnaireService;
      this.$log = $log;
      this.QuestionnaireService.list().success(function(list) {
        return angular.extend(_this.$scope, list);
      });
    }

    return QuestionnaireListController;

  })();

  this.Questionnaire.QuestionnaireController = (function() {

    QuestionnaireController.$inject = ['$scope', 'QuestionnaireService', '$log'];

    function QuestionnaireController($scope, QuestionnaireService, $log) {
      var _this = this;
      this.$scope = $scope;
      this.QuestionnaireService = QuestionnaireService;
      this.$log = $log;
      this.start = __bind(this.start, this);
      this.home = __bind(this.home, this);
      this.$scope.home = this.home;
      this.$scope.start = this.start;
      this.QuestionnaireService.currentQuestionnaire().success(function(questionnaire) {
        return _this.$scope.questionnaire = questionnaire;
      });
    }

    QuestionnaireController.prototype.home = function() {
      return this.$location.path('/');
    };

    QuestionnaireController.prototype.start = function() {
      return this.$location.path("/" + this.$scope.questionnaireId + "/1");
    };

    return QuestionnaireController;

  })();

  this.Questionnaire.QuestionController = (function() {

    QuestionController.$inject = ['$scope', '$routeParams', '$location', 'QuestionnaireService', '$log'];

    function QuestionController($scope, $routeParams, $location, QuestionnaireService, $log) {
      var questionIndex, _ref;
      this.$scope = $scope;
      this.$routeParams = $routeParams;
      this.$location = $location;
      this.QuestionnaireService = QuestionnaireService;
      this.$log = $log;
      this.isValid = __bind(this.isValid, this);
      this.onQuestionChanged = __bind(this.onQuestionChanged, this);
      this.$scope.questionnaireId = (_ref = $routeParams.questionnaire) != null ? _ref : '';
      questionIndex = Number($routeParams.questionIndex);
      if ((questionIndex != null) && !isNaN(questionIndex)) {
        this.$scope.questionIndex = questionIndex;
      } else {
        this.$location.redirectTo = '/';
      }
      this.$scope.isValid = this.isValid;
      $scope.$watch("questionIndex", this.onQuestionChanged);
    }

    QuestionController.prototype.onQuestionChanged = function() {
      var _this = this;
      if (!isNaN(this.$scope.questionIndex)) {
        return this.QuestionnaireService.get(this.$scope.questionnaireId).success(function(questionnaire) {
          var index, question, questions;
          questions = questionnaire.questions;
          index = _this.$scope.questionIndex - 1;
          question = questions[index];
          _this.$scope.question = question;
          _this.$scope.answer = _this.$scope.response.answers[index];
          _this.$scope.questionTemplate = "/templates/questions/" + question.type + ".html";
          _this.$scope.next = function() {
            if (index < questions.length - 1) {
              return _this.$location.path("/" + _this.$scope.questionnaireId + "/" + (index + 2));
            } else {
              return _this.$location.path("/" + _this.$scope.questionnaireId + "/summary");
            }
          };
          return _this.$scope.back = function() {
            return _this.$location.path("/" + _this.$scope.questionnaireId + "/" + index);
          };
        });
      }
    };

    QuestionController.prototype.isValid = function() {
      var _ref;
      return (_ref = this.$scope.answer) != null ? _ref.isValid : void 0;
    };

    return QuestionController;

  })();

  this.Questionnaire.IdentityQuestionController = (function() {

    IdentityQuestionController.$inject = ['$scope'];

    function IdentityQuestionController($scope) {
      var _this = this;
      this.$scope = $scope;
      this.$scope.$watch('answer.nhsIsValid && answer.dobIsValid', function(value) {
        _this.$scope.answer.isValid = value;
        return _this.$scope.answer.description = "" + _this.$scope.answer.nhs + " : " + _this.$scope.answer.dob;
      });
    }

    return IdentityQuestionController;

  })();

  this.Questionnaire.ChoiceQuestionController = (function() {

    ChoiceQuestionController.$inject = ['$scope'];

    function ChoiceQuestionController($scope) {
      this.$scope = $scope;
      this.selectChoice = __bind(this.selectChoice, this);
      this.choiceCSSClass = __bind(this.choiceCSSClass, this);
      this.$scope.choiceCSSClass = this.choiceCSSClass;
      this.$scope.selectChoice = this.selectChoice;
    }

    ChoiceQuestionController.prototype.choiceCSSClass = function(choice) {
      var _ref;
      if (((_ref = this.$scope.answer) != null ? _ref.choice : void 0) === choice) {
        return 'blue';
      } else {
        return 'white';
      }
    };

    ChoiceQuestionController.prototype.selectChoice = function(choice) {
      this.$scope.answer.choice = choice;
      this.$scope.answer.isValid = choice != null;
      return this.$scope.answer.description = choice.title;
    };

    return ChoiceQuestionController;

  })();

}).call(this);
