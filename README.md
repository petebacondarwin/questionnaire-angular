# Questionnaire - Response Collector

This project allows collection of questionnaire data through a web app, storing the responses in a CouchDB

Make sure you have couchdb installed somewhere (take a look at https://github.com/iriscouch/build-couchdb)

Start the local couchdb (on default port localhost:5984)

```$ /path/to/build-couchdb/build/bin/couchdb```

Make sure that you have kanso installed:

```$ sudo npm -g install kanso```

Clone my app:

```$ git clone git://github.com/petebacondarwin/questionnaire-angular.git
$ cd questionnaire-angular/app```

Install kanso dependencies:

```$ kanso install```

Push the app to the couchdb:

```$ kanso push questionnaire```

Upload some initial data to the couchdb

```$ kanso upload data/questionnaires/questionnaire```

Access the application in a browser at:

http://localhost:5984/questionnaire/_design/questionnaire/_rewrite/