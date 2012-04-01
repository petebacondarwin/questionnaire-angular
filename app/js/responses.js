(function() {

  angular.module('ServicesModule').service("ResponseService", [
    '$http', '$rootScope', '$q', '$routeParams', '$log', function($http, $rootScope, $q, $routeParams, $log) {
      var buildResponse;
      buildResponse = function(questionnaire, answers) {
        var now, response;
        now = new Date();
        return response = {
          _id: "response_" + questionnaire._id + "_" + (uuid.v1()),
          date: now.toDateString(),
          time: now.toTimeString(),
          type: 'response',
          answers: answers.map(function(answer) {
            return {
              name: answer.question.name,
              value: answer.value
            };
          })
        };
      };
      return this.submitResponse = function(questionnaire, answers) {
        var db, response;
        $log.log("ResponseService:  Submitting Response");
        response = buildResponse(questionnaire, answers);
        $log.log(response);
        db = new CouchDB('questionnaire');
        return db.save(response);
      };
    }
  ]);

}).call(this);
