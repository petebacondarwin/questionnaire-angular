(function() {

  angular.module('QuestionnaireModule', []).service("QuestionnaireService", [
    '$http', '$rootScope', '$q', '$routeParams', '$log', function($http, $rootScope, $q, $routeParams, $log) {
      var _this = this;
      $log.log("QuestionnaireService: Initializing");
      if (typeof questionnairePromises === "undefined" || questionnairePromises === null) {
        questionnairePromises = [];
      }
      this.list = function() {
        var _this = this;
        $log.log("QuestionnaireService: List Requested");
        return typeof questionnaireListPromise !== "undefined" && questionnaireListPromise !== null ? questionnaireListPromise : questionnaireListPromise = (function() {
          $log.log("QuestionnaireService: Downloading List");
          return $http.get('data/questionnaires.json').success(function(questionnaires) {
            return $log.log("QuestionnaireService: List Downloaded Successfully");
          });
        })();
      };
      this.currentQuestionnaireId = function() {
        var _ref;
        return (_ref = $routeParams.questionnaire) != null ? _ref : '';
      };
      this.currentQuestionIndex = function() {
        var index;
        index = $routeParams.questionIndex;
        if (index != null) index = Number(index);
        if (isNaN(index)) index = null;
        return index;
      };
      this.currentQuestionnaire = function() {
        var id;
        id = _this.currentQuestionnaireId();
        return _this.getQuestionnaire(id);
      };
      return this.getQuestionnaire = function(id) {
        var dummy;
        $log.log("QuestionnaireService: Questionnaire '" + id + "' Requested");
        if (id === '') {
          $log.log("QuestionnaireService: No Current Questionnaire");
          dummy = $q.defer();
          dummy.reject('Empty questionnaire id');
          return dummy.promise;
        }
        if (questionnairePromises[id] != null) {
          $log.log("QuestionnaireService: Questionnaire '" + id + "' From cache.");
        } else {
          $log.log("QuestionnaireService: Questionnaire '" + id + "' Downloading");
          questionnairePromises[id] = $http.get("data/questionnaires/" + id + ".json").then(function(response) {
            $log.log("QuestionnaireService: Questionnaire '" + id + "' Downloaded");
            return response.data;
          });
        }
        return questionnairePromises[id];
      };
    }
  ]);

}).call(this);
