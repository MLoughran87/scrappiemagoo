const db = require("../models/index.js");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
  // Main route for index page
  app.get("/", function(req, res) {
    db.Article.find({})
      .then(dbArticle => {
        res.render("index", { article: dbArticle });
      })
      .catch(err => {
        // If an error occurs, send it back to the client
        res.json(500, err);
      });
  });

  // Route that scrapes wikpedia.blog for articles and adds them to the database
  app.get("/article-search", (req, res) => {
    axios.get("https://blog.wikimedia.org/").then(response => {
      const $ = cheerio.load(response.data);
      let results = [];
      console.log("Search For blogs");
      $(".content").each(function(i, element) {
          console.log(element)
        let url = $(element)
          .find(".article-title")
          .children("p")
          .attr("href");
        let title = $(element)
          .find(".article-title")
          .children("h4")
          .text();
        let summary = $(element)
          .find(".article-entry")
          .attr("p")
          .text();
        let image = $(element)
          .find(".article-image")
          .attr("src");
        let result = {
          url: url,
          title: title,
          summary: summary,
          image: image,
        };

        db.Article.create({
          title: title,
          url: url,
          summary: summary,
          image: image,
        })

          .then(dbArticle => {
            console.log(dbArticle);
          })

          .catch(err => {
            res.json(500, err);
          });

        results.push(result);
      });

      res.redirect("/");
    });
  });

  // adding articles to database
  app.post("/article-submit", (req, res) => {
  
    db.Article.create(req.body)
      .then(dbArticle => {
        
        console.log(
          `An article was added to the database.\n @ ${dbArticle.date}`
        );
        res.json(dbArticle);
      })
      .catch(err => {
        // If error send the error to the client
        res.json(500, err);
      });
  });
};