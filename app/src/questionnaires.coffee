# A service that provides access to the questionnaire data
angular.module('ServicesModule',[]).service "QuestionnaireService",
    ['$http', '$rootScope', '$q', '$routeParams', '$log',
    ($http, $rootScope, $q, $routeParams, $log)->
      questionnairePromises ?= []

      # Get the promise of a list of questionnaires
      this.list = ()->
        questionnaireListPromise ?=
          $http.get('db/questionnaires')
            .then (response) => response.data.rows.map (row)->
              name: row.id
              title: row.value.title
              description: row.value.description

      this.currentQuestionnaireId = ()=>
        $routeParams.questionnaire ? ''

      this.currentQuestionIndex = ()=>
        index = Number($routeParams.questionIndex)
        if isNaN(index)
          index = null 
        return index

      # Get the promise of the current questionnaire
      this.currentQuestionnaire = ()=>
        id = this.currentQuestionnaireId()
        this.getQuestionnaire(id)

      this.getQuestionnaire = (id)=>
        if id is ''
          return $q.reject('Empty questionnaire id')
        questionnairePromises[id] ?= 
            $http.get("db/questionnaire/#{id}")
              .then (response)=> response.data
    ]