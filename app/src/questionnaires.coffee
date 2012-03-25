# A service that provides access to the questionnaire data
class QuestionnaireService
  @$inject: ['$http', '$rootScope', '$q', '$log']
  constructor: (@$http, @$rootScope, @$q, @$log)->
    @$log.log "QuestionnaireService: Initializing"

    # Listen for changes on the route to the current questionnaire and question 
    @$rootScope.$on '$afterRouteChange', (event, current, previous)=>
      @currentQuestionnaireId = current.params.questionnaire ? ''
      @currentQuestionIndex = current.params.questionIndex ? ''

    # If the questionnaire changes then clear the response
    @$rootScope.$watch(
      () => @currentQuestionnaireId
    ,
      ()=> @currentResponse = null )

  # Get the promise of a list of questionnaires
  list: ()->
    @$log.log "QuestionnaireService: List Requested"
    @questionnaireListPromise ?=
      do ()=>
        @$log.log "QuestionnaireService: Downloading List"
        @$http.get('data/questionnaires.json')
          .success (questionnaires)=> @$log.log "QuestionnaireService: List Downloaded Successfully"

  # Get the promise of the current questionnaire
  currentQuestionnaire: ()->
    @$log.log "QuestionnaireService: Current Questionnaire Requested"
    if @currentQuestionnaireId isnt ''
      @$log.log "QuestionnaireService: Questionnaire '#{@currentQuestionnaireId}' Requested"
      @questionnairePromises ?= []
      @questionnairePromises[@currentQuestionnaireId] ?=
        do ()=>
          @$log.log "QuestionnaireService: Questionnaire '#{@currentQuestionnaireId}' Downloading"
          @$http.get("data/questionnaires/#{@currentQuestionnaireId}.json")
            .success (questionnaire)=> @$log.log "QuestionnaireService: Questionnaire '#{@currentQuestionnaireId}' Downloaded"
    else
      @$log.log "QuestionnaireService: No Current Questionnaire"
      dummy = @$q.defer()
      dummy.reject('Empty questionnaire id')
      dummy.promise

  # Get the promise of a response to the current questionnaire
  currentResponse: ()->
    @$log.log "QuestionnaireService: Current Response Requested"
    @currentQuestionnaire().then (questionnaire)->
      @currentResponse ?= newResponse(questionnaire)

  # Build a new response from the supplied questionnaire
  newResponse: (questionnaire)=>
    now = new Date()
    response =
      questionnaire: questionnaire._id
      date: now.toDateString()
      time: now.getTime()
      type: 'response'
      answers: questionnaire.questions.map (question, index)->
        question: question      # the question being answered
        questionIndex: index+1  # questionIndex is 1-based
        isValid: false          # initially all answers are invalid


# Declare this service in an angular module
angular.module('QuestionnaireModule', [])
  .service("QuestionnaireService", QuestionnaireService)


