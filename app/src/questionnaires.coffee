# A service that provides access to the questionnaire data
class QuestionnaireService
  @$inject: ['$http', '$rootScope', '$q', '$routeParams', '$log']
  constructor: (@$http, @$rootScope, @$q, @$routeParams, @$log)->
    @$log.log "QuestionnaireService: Initializing"
    @questionnairePromises ?= []

  # Get the promise of a list of questionnaires
  list: ()->
    @$log.log "QuestionnaireService: List Requested"
    @questionnaireListPromise ?=
      do ()=>
        @$log.log "QuestionnaireService: Downloading List"
        @$http.get('data/questionnaires.json')
          .success (questionnaires)=> @$log.log "QuestionnaireService: List Downloaded Successfully"

  currentQuestionnaireId: ()=>
    @$routeParams.questionnaire ? ''

  currentQuestionIndex: ()=>
    index = @$routeParams.questionIndex
    index = Number(index) if index?
    index = null if isNaN(index)
    return index

  # Get the promise of the current questionnaire
  currentQuestionnaire: ()=>
    id = @currentQuestionnaireId()
    @getQuestionnaire(id)

  getQuestionnaire: (id)=>
    @$log.log "QuestionnaireService: Questionnaire '#{id}' Requested"

    if id is ''
      @$log.log "QuestionnaireService: No Current Questionnaire"
      dummy = @$q.defer()
      dummy.reject('Empty questionnaire id')
      return dummy.promise

    if @questionnairePromises[id]?
      @$log.log "QuestionnaireService: Questionnaire '#{id}' From cache." 
    else
      @$log.log "QuestionnaireService: Questionnaire '#{id}' Downloading"
      @questionnairePromises[id] = 
        @$http.get("data/questionnaires/#{id}.json")
          .then (response)=>
            @$log.log "QuestionnaireService: Questionnaire '#{id}' Downloaded"
            response.data
    @questionnairePromises[id]


# Declare this service in an angular module
angular.module('QuestionnaireModule', [])
  .service("QuestionnaireService", QuestionnaireService)


