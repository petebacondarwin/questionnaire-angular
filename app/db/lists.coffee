# List functions to be exported from the design doc.
exports.responses = (head,req)->
  headingInfo = [
    {"name": "questionnaire", "title": "Questionnaire"},
    {"name": "date", "title": "Date"},
    {"name": "hash", "title": "Respondent Hash"},
    {"name": "question-1", "title": "Question 1"},
    {"name": "question-2", "title": "Question 2"},
    {"name": "question-3", "title": "Question 3"},
    {"name": "_id", "title": "Reponse Id"},
    {"name": "_rev", "title": "Response Revision"}
  ]

  headings = headingInfo.map (item)-> item.title

  provides "cvs", ()->
    start
      headers : 
        "Content-Disposition": "filename=responses.csv"

    send headings.join(",") + "\n"

    while(row = getRow())
      fields = headingInfo.map (item)-> row.value[item.name]
      send fields.join(",") + "\n"

  provides "html", ()->
    send "<html>\n<head>\n<meta charset='utf-8'>\n</head>\n<body>\n<table>\n"
    send "<thead>\n<tr><td>" + headings.join("</td><td>") + "</td></tr>\n</thead>\n"
    send "<tbody>\n"

    while(row = getRow())
      fields = headingInfo.map (item)-> row.value[item.name]
      send "<tr><td>" + fields.join("</td><td>") + "</td></tr>\n"

    send "</tbody>\n</table>\n</body>\n</html>"

