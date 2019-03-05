// mongoose
const mongoose = require("mongoose");

//  mongoose Schema constructor
const Schema = mongoose.Schema;

// Schema Object
const ArticleSchema = new Schema({
  title: {
    type: String,
  },
  summary: {
    type: String,
  },
  url: {
    type: String,
  },
  image: {
    type: String,
  },

});

// the Article model 
const Article = mongoose.model("Article", ArticleSchema);

// Export Article 
module.exports = Article;