// Values exported from this module will automatically be used to generate the design doc pushed to CouchDB.
module.exports = {
  views: require('./views'),
  rewrites: require('./rewrites'),
  validate_doc_update: function(newDoc, oldDoc, userCtx) {}
};
