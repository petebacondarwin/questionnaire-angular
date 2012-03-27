'use strict'
@Questionnaire ?= {}

class @Questionnaire.AppController
  @$inject: ['$scope','QuestionnaireService', '$location', '$log']
  constructor: (@$scope, @QuestionnaireService, @$location, @$log)->
    @$scope.$on ('$afterRouteChange'), @onRouteChanged

  # Rewire the scope when the route changes
  onRouteChanged: ()=>
    @$log.log "Route has changed - getting questionnaire"

    @$scope.questionnaireId = @QuestionnaireService.currentQuestionnaireId()
    @$scope.questionIndex = @QuestionnaireService.currentQuestionIndex()

    if @$scope.questionnaireId?
      # Wait for the questionnaire to arrive ...
      @QuestionnaireService.getQuestionnaire(@$scope.questionnaireId).then (questionnaire)=>
        # ... then update the scope
        @updateScopeForQuestionnaire(questionnaire)

  updateScopeForQuestionnaire: (questionnaire)=>
    # Ensure that the scope has a reference to the current questionnaire
    @$scope.questionnaire = questionnaire
    @$scope.numQuestions = questionnaire.questions.length

    # General navigation helpers
    @$scope.questionnaireUrl = "#{@$scope.questionnaireId}"
    @$scope.home = ()=> @$location.path('/')
    @$scope.start = ()=> @$location.path("#{@$scope.questionnaireUrl}/1")

    # Create a response if we don't have one already
    if @$scope.response?.questionnaire isnt @$scope.questionnaire._id
      @$scope.response = @createResponse(questionnaire)

    # Are we on a question?
    if @$scope.questionIndex?
      # Redirect if the questionIndex is invalid
      @$location.path('/') if not (@$scope.questionIndex? and 1 <= @$scope.questionIndex <= @$scope.numQuestions)
      # Ensure that the scope has a reference to the current question
      @$scope.question = questionnaire.questions[@$scope.questionIndex-1] # questionIndex is 1-based
      # Ensure that the scope has a reference to the current answer
      @$scope.answer = @$scope.response.answers[@$scope.questionIndex-1]

      @$scope.questionTemplate = (questionType)-> "/templates/questions/#{questionType}.html"

      # Question specific navigation helpers
      @$scope.notFirst = ()=> @$scope.questionIndex > 1
      @$scope.notLast = ()=> @$scope.questionIndex < @$scope.numQuestions
      @$scope.summary = ()=> @$location.path(@$scope.questionnaireUrl + '/summary')
      @$scope.first = ()=> @$location.path(@$scope.questionnaireUrl)
      @$scope.back = ()=> @$location.path(@$scope.questionnaireUrl + "/#{@$scope.questionIndex - 1}")
      @$scope.next = ()=> @$location.path("#{@$scope.questionnaireUrl}/#{@$scope.questionIndex + 1}")
      @$scope.last = ()=> @$location.path(@$scope.questionnaireUrl + "/#{@$scope.numQuestions}")
      @$scope.showNext = ()=> @$scope.isValid() and @$scope.notLast()
      # Validity helpers
      @$scope.isValid = ()=> @$scope.answer?.isValid
      @$scope.isInvalid = ()=> not @$scope.isValid()
      @$scope.allValid = ()=> @$scope.response?.answers?.every (answer)-> answer.isValid

  # Build a new response from the supplied questionnaire
  createResponse: (questionnaire)=>
    @$log.log "AppController: Creating a new response for questionnaire: #{questionnaire._id}"
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


# Controls the display of the list of questionnaires
class @Questionnaire.QuestionnaireListController
  @$inject: ['$scope', 'QuestionnaireService', '$log']
  constructor: (@$scope, @QuestionnaireService, @$log)->
    @QuestionnaireService.list().success (list)=>
      angular.extend(@$scope, list) # Merge list into scope

    

class @Questionnaire.IdentityQuestionController
  @$inject: ['$scope']
  constructor: (@$scope)->
    @$scope.dateOptions =
      changeMonth: true
      changeYear: true
      dateFormat: 'dd/mm/yy'
      yearRange: '1900:-0'
      constrainInput: true

    # Watch the identity form and update the answer validity accordingly
    @$scope.$watch (()=> "#{@$scope.identityForm.$valid}"), (value)=>
      @$scope.answer.isValid = $scope.identityForm.$valid

    # Watch the identity form and update the answer description accordingly
    @$scope.$watch (()=>"#{@$scope.answer.nhs} : #{@$scope.answer.dob}"), (value)=>
      @$scope.answer.description = "#{@$scope.answer.nhs} : #{@$scope.answer.dob}"

# Controls the behaviour of a multichoice question
class @Questionnaire.ChoiceQuestionController
  @$inject: ['$scope']
  constructor: (@$scope)->
    
    @$scope.choiceCSSClass = (choice)=>
      if @$scope.answer?.choice is choice 
        'blue'
      else
        'white'

    @$scope.selectChoice = (choice)=>
      @$scope.answer.choice = choice
      @$scope.answer.isValid = choice?
      @$scope.answer.description = choice.title