// Rewrite settings to be exported from the design doc
module.exports = [
  {
     "from":"/db/responses",
     "to":"_list/responses/responses"
  },
  {
     "from":"/db/questionnaires",
     "to":"_view/questionnaires"
  },
  {
    "from": "/db/questionnaire/*",
    "to": "../../*"
  },
  { // keeping relative urls sane
    "from":"/*",
    "to":"/*"
  }
]
