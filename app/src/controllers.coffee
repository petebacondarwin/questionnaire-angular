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
    if @$scope.questionnaire?._id != questionnaire._id
      @$scope.questionnaire = questionnaire
      @$scope.numQuestions = questionnaire.questions.length
      @$scope.answers = @createAnswerHolder(questionnaire)

    # General navigation helpers
    @$scope.questionnaireUrl = "#{@$scope.questionnaireId}"
    @$scope.home = ()=> @$location.path('/')
    @$scope.start = ()=> @$location.path("#{@$scope.questionnaireUrl}/1")

    # Are we on a question?
    if @$scope.questionIndex?
      # Redirect if the questionIndex is invalid
      @$location.path('/') if not (@$scope.questionIndex? and 1 <= @$scope.questionIndex <= @$scope.numQuestions)
      # Ensure that the scope has a reference to the current question
      @$scope.question = questionnaire.questions[@$scope.questionIndex-1] # questionIndex is 1-based
      # Ensure that the scope has a reference to the current answer
      @$scope.answer = @$scope.answers[@$scope.questionIndex-1]

      @$scope.questionTemplate = (questionType)-> "templates/questions/#{questionType}.html"

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
      @$scope.allValid = ()=> @$scope.answers?.every (answer)-> answer.isValid

  # Build an object to hold answers to the supplied questionnaire
  createAnswerHolder: (questionnaire)=>
    @$log.log "AppController: Creating a new set of answers for questionnaire: #{questionnaire._id}"
    answers = questionnaire.questions.map (question, index)->
      question: question      # the question being answered
      questionIndex: index+1  # questionIndex is 1-based
      isValid: false          # initially all answers are invalid



# Controls the display of the list of questionnaires
class @Questionnaire.QuestionnaireListController
  @$inject: ['$scope', 'QuestionnaireService', '$log']
  constructor: (@$scope, @QuestionnaireService, @$log)->
    @QuestionnaireService.list().then (questionnaires)=>
      @$scope.questionnaires = questionnaires
   
# Controls the display of the question that asks for the users identity
class @Questionnaire.IdentityQuestionController
  @$inject: ['$scope']
  constructor: (@$scope)->
    @$scope.dateOptions =
      changeMonth: true, changeYear: true
      yearRange: '1900:-0'

    # Watch the identity form and update the answer validity accordingly
    @$scope.$watch (()=> "#{@$scope.identityForm.$valid}"), (value)=>
      answer = @$scope.answer
      answer.value = hex_md5(answer.nhs + ":" + @$scope.niceDate(answer.dob))
      answer.isValid = $scope.identityForm.$valid

    @$scope.niceDate = (date)=>
      dateString = @$scope.$eval('answer.dob | date : "dd MMM yyyy"')

    # Watch the identity form and update the answer description accordingly
    @$scope.$watch (()=>"#{@$scope.answer.nhs} : #{@$scope.answer.dob}"), (value)=>
      @$scope.answer.description = "NHS: #{@$scope.answer.nhs} <br/>DoB: #{@$scope.niceDate(@$scope.answer.dob)}"

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
      angular.extend @$scope.answer, 
        choice: choice
        isValid: choice?
        description: choice.title
        value: choice.value

# Controls the submission of the response
class @Questionnaire.SubmissionController
  @$inject: ['$scope', '$location', 'ResponseService']
  constructor: ($scope, $location, ResponseService)->
    $scope.submit = ()->
      ResponseService.submitResponse($scope.questionnaire, $scope.answers)

      # TODO: clear the questionnaire and answers
      
      $location.path(@$scope.questionnaireUrl + "/complete")