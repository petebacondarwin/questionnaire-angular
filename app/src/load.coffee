"use strict";

head.js(
  # load files in parallel but execute them in sequence
  { jquery        : "/lib/jquery.min.js" }
  { maskedinput   : "/lib/jquery.maskedinput-1.3.js" }
  { jqueryUI      : "/lib/jquery.ui/jquery-ui-1.8.18.min.js" }
  { angular       : "/lib/angular/angular.js" }
  { controllers   : "/js/controllers.js" }
  { questionnaires: "/js/questionnaires.js" }
  { widgets       : "/js/widgets.js" }
  { application   : "/js/app.js" }
)

head.ready( "application", ->
  # Declare app-level module which depends on filters, and services
  module = angular.module( 'QuestionnaireApp', ['AppConfig', 'QuestionnaireModule', 'WidgetModule'] )
)
