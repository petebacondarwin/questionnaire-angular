// Rewrite settings to be exported from the design doc
module.exports = [
  {
    "from":"/",
    "to":"index.html"
  },
  {
     "from":"/responses",
     "to":"_view/responses"
  },
  {
     "from":"/questionnaires",
     "to":"_view/questionnaires"
  },
  {
    "from": "/questionnaire/*",
    "to": "../../*"
  },
  { // keeping relative urls sane
    "from":"/*",
    "to":"/*"
  }
]
