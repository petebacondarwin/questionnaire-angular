(function() {
  var QuestionnaireService,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  QuestionnaireService = (function() {

    QuestionnaireService.$inject = ['$http', '$rootScope', '$q', '$log'];

    function QuestionnaireService($http, $rootScope, $q, $log) {
      var _this = this;
      this.$http = $http;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.$log = $log;
      this.newResponse = __bind(this.newResponse, this);
      this.$log.log("QuestionnaireService: Initializing");
      this.$rootScope.$on('$afterRouteChange', function(event, current, previous) {
        var _ref, _ref2;
        _this.currentQuestionnaireId = (_ref = current.params.questionnaire) != null ? _ref : '';
        return _this.currentQuestionIndex = (_ref2 = current.params.questionIndex) != null ? _ref2 : '';
      });
      this.$rootScope.$watch(function() {
        return _this.currentQuestionnaireId;
      }, function() {
        return _this.currentResponse = null;
      });
    }

    QuestionnaireService.prototype.list = function() {
      var _ref,
        _this = this;
      this.$log.log("QuestionnaireService: List Requested");
      return (_ref = this.questionnaireListPromise) != null ? _ref : this.questionnaireListPromise = (function() {
        _this.$log.log("QuestionnaireService: Downloading List");
        return _this.$http.get('data/questionnaires.json').success(function(questionnaires) {
          return _this.$log.log("QuestionnaireService: List Downloaded Successfully");
        });
      })();
    };

    QuestionnaireService.prototype.currentQuestionnaire = function() {
      var dummy, _base, _name, _ref,
        _this = this;
      this.$log.log("QuestionnaireService: Current Questionnaire Requested");
      if (this.currentQuestionnaireId !== '') {
        this.$log.log("QuestionnaireService: Questionnaire '" + this.currentQuestionnaireId + "' Requested");
        if (this.questionnairePromises == null) this.questionnairePromises = [];
        return (_ref = (_base = this.questionnairePromises)[_name = this.currentQuestionnaireId]) != null ? _ref : _base[_name] = (function() {
          _this.$log.log("QuestionnaireService: Questionnaire '" + _this.currentQuestionnaireId + "' Downloading");
          return _this.$http.get("data/questionnaires/" + _this.currentQuestionnaireId + ".json").success(function(questionnaire) {
            return _this.$log.log("QuestionnaireService: Questionnaire '" + _this.currentQuestionnaireId + "' Downloaded");
          });
        })();
      } else {
        this.$log.log("QuestionnaireService: No Current Questionnaire");
        dummy = this.$q.defer();
        dummy.reject('Empty questionnaire id');
        return dummy.promise;
      }
    };

    QuestionnaireService.prototype.currentResponse = function() {
      this.$log.log("QuestionnaireService: Current Response Requested");
      return this.currentQuestionnaire().then(function(questionnaire) {
        var _ref;
        return (_ref = this.currentResponse) != null ? _ref : this.currentResponse = newResponse(questionnaire);
      });
    };

    QuestionnaireService.prototype.newResponse = function(questionnaire) {
      var now, response;
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

    return QuestionnaireService;

  })();

  angular.module('QuestionnaireModule', []).service("QuestionnaireService", QuestionnaireService);

}).call(this);
