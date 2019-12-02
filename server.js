require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/imageperformance",
  {
    useNewUrlParser: true
  }
);

app.listen(PORT, function() {
  console.log(`Now listening on port: ${PORT}`);
});
