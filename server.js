if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const stripePublishKey = process.env.STRIPE_PUBLISH_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let express = require("express");
let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(3000);
