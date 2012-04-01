// Show functions to be exported from the design doc.
exports.questionnaires = {
    map: function(doc) {
        if(doc.type === "questionnaire") {
            emit(doc.sortOrder, {title: doc.title, description: doc.description});
        }
    }
};
exports.responses = {
    map: function(doc) {
        if(doc.type === "response") {
            emit([doc.questionnaire, doc.hash], doc)
        }
    }
};
