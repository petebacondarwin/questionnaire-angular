"use strict";

head.js(
  # load files in parallel but execute them in sequence
  { jquery        : "/lib/jquery.min.js" }
  { md5           : "/lib/md5.min.js" }
  { uuid          : "/lib/uuid.js" }
  { maskedinput   : "/lib/jquery.maskedinput-1.3.js" }
  { jqueryUI      : "/lib/jquery.ui/jquery-ui-1.8.18.min.js" }
  { angular       : "/lib/angular/angular.js" }
  { controllers   : "/js/controllers.js" }
  { questionnaires: "/js/questionnaires.js" }
  { responses     : "/js/responses.js" }
  { widgets       : "/js/widgets.js" }
  { application   : "/js/app.js" }
)

head.ready( "application", ->
  # Declare app-level module which depends on filters, and services
  module = angular.module( 'QuestionnaireApp', ['AppConfig', 'QuestionnaireModule', 'ResponseModule', 'WidgetModule'] )
)
