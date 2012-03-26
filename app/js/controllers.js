(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.Questionnaire == null) this.Questionnaire = {};

  this.Questionnaire.AppController = (function() {

    AppController.$inject = ['$scope', 'QuestionnaireService', '$location', '$log'];

    function AppController($scope, QuestionnaireService, $location, $log) {
      this.$scope = $scope;
      this.QuestionnaireService = QuestionnaireService;
      this.$location = $location;
      this.$log = $log;
      this.createResponse = __bind(this.createResponse, this);
      this.updateScopeForQuestionnaire = __bind(this.updateScopeForQuestionnaire, this);
      this.onRouteChanged = __bind(this.onRouteChanged, this);
      this.$scope.$on('$afterRouteChange', this.onRouteChanged);
    }

    AppController.prototype.onRouteChanged = function() {
      var _this = this;
      this.$log.log("Route has changed - getting questionnaire");
      this.$scope.questionnaireId = this.QuestionnaireService.currentQuestionnaireId();
      this.$scope.questionIndex = this.QuestionnaireService.currentQuestionIndex();
      if (this.$scope.questionnaireId != null) {
        return this.QuestionnaireService.getQuestionnaire(this.$scope.questionnaireId).then(function(questionnaire) {
          return _this.updateScopeForQuestionnaire(questionnaire);
        });
      }
    };

    AppController.prototype.updateScopeForQuestionnaire = function(questionnaire) {
      var _ref, _ref2,
        _this = this;
      this.$scope.questionnaire = questionnaire;
      this.$scope.numQuestions = questionnaire.questions.length;
      this.$scope.questionnaireUrl = "" + this.$scope.questionnaireId;
      this.$scope.home = function() {
        return _this.$location.path('/');
      };
      this.$scope.start = function() {
        return _this.$location.path("" + _this.$scope.questionnaireUrl + "/1");
      };
      if (((_ref = this.$scope.response) != null ? _ref.questionnaire : void 0) !== this.$scope.questionnaire._id) {
        this.$scope.response = this.createResponse(questionnaire);
      }
      if (this.$scope.questionIndex != null) {
        if (!((this.$scope.questionIndex != null) && (1 <= (_ref2 = this.$scope.questionIndex) && _ref2 <= this.$scope.numQuestions))) {
          this.$location.path('/');
        }
        this.$scope.question = questionnaire.questions[this.$scope.questionIndex - 1];
        this.$scope.answer = this.$scope.response.answers[this.$scope.questionIndex - 1];
        this.$scope.questionTemplate = function(questionType) {
          return "/templates/questions/" + questionType + ".html";
        };
        this.$scope.notFirst = function() {
          return _this.$scope.questionIndex > 1;
        };
        this.$scope.notLast = function() {
          return _this.$scope.questionIndex < _this.$scope.numQuestions;
        };
        this.$scope.summary = function() {
          return _this.$location.path(_this.$scope.questionnaireUrl + '/summary');
        };
        this.$scope.first = function() {
          return _this.$location.path(_this.$scope.questionnaireUrl);
        };
        this.$scope.back = function() {
          return _this.$location.path(_this.$scope.questionnaireUrl + ("/" + (_this.$scope.questionIndex - 1)));
        };
        this.$scope.next = function() {
          return _this.$location.path("" + _this.$scope.questionnaireUrl + "/" + (_this.$scope.questionIndex + 1));
        };
        this.$scope.last = function() {
          return _this.$location.path(_this.$scope.questionnaireUrl + ("/" + _this.$scope.numQuestions));
        };
        this.$scope.showNext = function() {
          return _this.$scope.isValid() && _this.$scope.notLast();
        };
        this.$scope.isValid = function() {
          var _ref3;
          return (_ref3 = _this.$scope.answer) != null ? _ref3.isValid : void 0;
        };
        this.$scope.isInvalid = function() {
          return !_this.$scope.isValid();
        };
        return this.$scope.allValid = function() {
          var _ref3, _ref4;
          return (_ref3 = _this.$scope.response) != null ? (_ref4 = _ref3.answers) != null ? _ref4.every(function(answer) {
            return answer.isValid;
          }) : void 0 : void 0;
        };
      }
    };

    AppController.prototype.createResponse = function(questionnaire) {
      var now, response;
      this.$log.log("AppController: Creating a new response for questionnaire: " + questionnaire._id);
      now = new Date();
      return response = {
        questionnaire: questionnaire._id,
        date: now.toDateString(),
        time: now.getTime(),
        type: 'response',
        answers: questionnaire.questions.map(function(question, index) {
          return {
            question: question,
            questionIndex: index + 1,
            isValid: false
          };
        })
      };
    };

    return AppController;

  })();

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

  this.Questionnaire.IdentityQuestionController = (function() {

    IdentityQuestionController.$inject = ['$scope'];

    function IdentityQuestionController($scope) {
      var _this = this;
      this.$scope = $scope;
      this.$scope.$watch('answer.nhsIsValid && answer.dobIsValid', function(value) {
        _this.$scope.answer.isValid = true;
        return _this.$scope.answer.description = "" + _this.$scope.answer.nhs + " : " + _this.$scope.answer.dob;
      });
    }

    return IdentityQuestionController;

  })();

  this.Questionnaire.ChoiceQuestionController = (function() {

    ChoiceQuestionController.$inject = ['$scope'];

    function ChoiceQuestionController($scope) {
      var _this = this;
      this.$scope = $scope;
      this.$scope.choiceCSSClass = function(choice) {
        var _ref;
        if (((_ref = _this.$scope.answer) != null ? _ref.choice : void 0) === choice) {
          return 'blue';
        } else {
          return 'white';
        }
      };
      this.$scope.selectChoice = function(choice) {
        _this.$scope.answer.choice = choice;
        _this.$scope.answer.isValid = choice != null;
        return _this.$scope.answer.description = choice.title;
      };
    }

    return ChoiceQuestionController;

  })();

}).call(this);
