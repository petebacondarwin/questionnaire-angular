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
      this.createAnswerHolder = __bind(this.createAnswerHolder, this);
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
      if (((_ref = this.$scope.questionnaire) != null ? _ref._id : void 0) !== questionnaire._id) {
        this.$scope.questionnaire = questionnaire;
        this.$scope.numQuestions = questionnaire.questions.length;
        this.$scope.answers = this.createAnswerHolder(questionnaire);
      }
      this.$scope.questionnaireUrl = "" + this.$scope.questionnaireId;
      this.$scope.home = function() {
        return _this.$location.path('/');
      };
      this.$scope.start = function() {
        return _this.$location.path("" + _this.$scope.questionnaireUrl + "/1");
      };
      if (this.$scope.questionIndex != null) {
        if (!((this.$scope.questionIndex != null) && (1 <= (_ref2 = this.$scope.questionIndex) && _ref2 <= this.$scope.numQuestions))) {
          this.$location.path('/');
        }
        this.$scope.question = questionnaire.questions[this.$scope.questionIndex - 1];
        this.$scope.answer = this.$scope.answers[this.$scope.questionIndex - 1];
        this.$scope.questionTemplate = function(questionType) {
          return "templates/questions/" + questionType + ".html";
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
          var _ref3;
          return (_ref3 = _this.$scope.answers) != null ? _ref3.every(function(answer) {
            return answer.isValid;
          }) : void 0;
        };
      }
    };

    AppController.prototype.createAnswerHolder = function(questionnaire) {
      var answers;
      this.$log.log("AppController: Creating a new set of answers for questionnaire: " + questionnaire._id);
      return answers = questionnaire.questions.map(function(question, index) {
        return {
          question: question,
          questionIndex: index + 1,
          isValid: false
        };
      });
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
      this.QuestionnaireService.list().then(function(questionnaires) {
        return _this.$scope.questionnaires = questionnaires;
      });
    }

    return QuestionnaireListController;

  })();

  this.Questionnaire.IdentityQuestionController = (function() {

    IdentityQuestionController.$inject = ['$scope'];

    function IdentityQuestionController($scope) {
      var _this = this;
      this.$scope = $scope;
      this.$scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:-0'
      };
      this.$scope.$watch((function() {
        return "" + _this.$scope.identityForm.$valid;
      }), function(value) {
        var answer;
        answer = _this.$scope.answer;
        answer.value = hex_md5(answer.nhs + ":" + _this.$scope.niceDate(answer.dob));
        return answer.isValid = $scope.identityForm.$valid;
      });
      this.$scope.niceDate = function(date) {
        var dateString;
        return dateString = _this.$scope.$eval('answer.dob | date : "dd MMM yyyy"');
      };
      this.$scope.$watch((function() {
        return "" + _this.$scope.answer.nhs + " : " + _this.$scope.answer.dob;
      }), function(value) {
        return _this.$scope.answer.description = "NHS: " + _this.$scope.answer.nhs + " <br/>DoB: " + (_this.$scope.niceDate(_this.$scope.answer.dob));
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
        return angular.extend(_this.$scope.answer, {
          choice: choice,
          isValid: choice != null,
          description: choice.title,
          value: choice.value
        });
      };
    }

    return ChoiceQuestionController;

  })();

  this.Questionnaire.SubmissionController = (function() {

    SubmissionController.$inject = ['$scope', '$location', 'ResponseService'];

    function SubmissionController($scope, $location, ResponseService) {
      $scope.submit = function() {
        ResponseService.submitResponse($scope.questionnaire, $scope.answers);
        return $location.path(this.$scope.questionnaireUrl + "/complete");
      };
    }

    return SubmissionController;

  })();

}).call(this);
