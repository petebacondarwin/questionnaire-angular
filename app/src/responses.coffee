# A service that provides access to the questionnaire data
angular.module('ServicesModule').service "ResponseService",
  ['$http', '$rootScope', '$q', '$routeParams', '$log',
  ($http, $rootScope, $q, $routeParams, $log)->
    buildResponse = (questionnaire, answers)->
      now = new Date()
      response =
        _id: "response_#{questionnaire._id}_#{uuid.v4()}"
        date: now.toDateString()
        time: now.toTimeString()
        type: 'response'
        answers: answers.map (answer)->
            name: answer.question.name
            value: answer.value

    this.submitResponse = (questionnaire, answers)->
      $log.log "ResponseService:  Submitting Response"
      response = buildResponse(questionnaire, answers)
      $log.log response
      db = new CouchDB('questionnaire')
      db.save(response)
  ]