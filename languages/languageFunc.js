var fs = require("fs");
var path = require("path");

module.exports.languages = async (lang) => {
  var lan = ["en", "fr", "hindi", "ar"];

  if (lang !== "" && lang !== undefined && lan.includes(lang)) {
    var langpath = __dirname + `/${lang}.json`;
    if (fs.existsSync(langpath)) {
      var language = require("../languages/" + lang + ".json");
    } else {
      var language = require("../languages/en.json");
    }
  } else {
    var language = require("../languages/en.json");
  }
  return language;
};
