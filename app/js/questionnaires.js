(function() {
  var QuestionnaireService,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  QuestionnaireService = (function() {

    QuestionnaireService.$inject = ['$http', '$rootScope', '$q', '$routeParams', '$log'];

    function QuestionnaireService($http, $rootScope, $q, $routeParams, $log) {
      this.$http = $http;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.$routeParams = $routeParams;
      this.$log = $log;
      this.getQuestionnaire = __bind(this.getQuestionnaire, this);
      this.currentQuestionnaire = __bind(this.currentQuestionnaire, this);
      this.currentQuestionIndex = __bind(this.currentQuestionIndex, this);
      this.currentQuestionnaireId = __bind(this.currentQuestionnaireId, this);
      this.$log.log("QuestionnaireService: Initializing");
      if (this.questionnairePromises == null) this.questionnairePromises = [];
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

    QuestionnaireService.prototype.currentQuestionnaireId = function() {
      var _ref;
      return (_ref = this.$routeParams.questionnaire) != null ? _ref : '';
    };

    QuestionnaireService.prototype.currentQuestionIndex = function() {
      var index;
      index = this.$routeParams.questionIndex;
      if (index != null) index = Number(index);
      if (isNaN(index)) index = null;
      return index;
    };

    QuestionnaireService.prototype.currentQuestionnaire = function() {
      var id;
      id = this.currentQuestionnaireId();
      return this.getQuestionnaire(id);
    };

    QuestionnaireService.prototype.getQuestionnaire = function(id) {
      var dummy,
        _this = this;
      this.$log.log("QuestionnaireService: Questionnaire '" + id + "' Requested");
      if (id === '') {
        this.$log.log("QuestionnaireService: No Current Questionnaire");
        dummy = this.$q.defer();
        dummy.reject('Empty questionnaire id');
        return dummy.promise;
      }
      if (this.questionnairePromises[id] != null) {
        this.$log.log("QuestionnaireService: Questionnaire '" + id + "' From cache.");
      } else {
        this.$log.log("QuestionnaireService: Questionnaire '" + id + "' Downloading");
        this.questionnairePromises[id] = this.$http.get("data/questionnaires/" + id + ".json").then(function(response) {
          _this.$log.log("QuestionnaireService: Questionnaire '" + id + "' Downloaded");
          return response.data;
        });
      }
      return this.questionnairePromises[id];
    };

    return QuestionnaireService;

  })();

  angular.module('QuestionnaireModule', []).service("QuestionnaireService", QuestionnaireService);

}).call(this);
