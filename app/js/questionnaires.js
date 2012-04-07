(function() {

  angular.module('ServicesModule', []).service("QuestionnaireService", [
    '$http', '$rootScope', '$q', '$routeParams', '$log', function($http, $rootScope, $q, $routeParams, $log) {
      var _this = this;
      if (typeof questionnairePromises === "undefined" || questionnairePromises === null) {
        questionnairePromises = [];
      }
      this.list = function() {
        var _this = this;
        return typeof questionnaireListPromise !== "undefined" && questionnaireListPromise !== null ? questionnaireListPromise : questionnaireListPromise = $http.get('questionnaires').then(function(response) {
          return response.data.rows.map(function(row) {
            return {
              name: row.id,
              title: row.value.title,
              description: row.value.description
            };
          });
        });
      };
      this.currentQuestionnaireId = function() {
        var _ref;
        return (_ref = $routeParams.questionnaire) != null ? _ref : '';
      };
      this.currentQuestionIndex = function() {
        var index;
        index = Number($routeParams.questionIndex);
        if (isNaN(index)) index = null;
        return index;
      };
      this.currentQuestionnaire = function() {
        var id;
        id = _this.currentQuestionnaireId();
        return _this.getQuestionnaire(id);
      };
      return this.getQuestionnaire = function(id) {
        var _ref;
        if (id === '') return $q.reject('Empty questionnaire id');
        return (_ref = questionnairePromises[id]) != null ? _ref : questionnairePromises[id] = $http.get("questionnaire/" + id).then(function(response) {
          return response.data;
        });
      };
    }
  ]);

}).call(this);
