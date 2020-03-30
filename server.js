if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let express = require("express");

let app = express();
app.use(express.json());
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static("public"));

const stripe = require("stripe")(stripeSecretKey);

app.get("/store", (req, res) => {
  fs.readFile("./items.json", (error, data) => {
    if (error) {
      res.status(505).end();
    } else {
      res.render("store.ejs", {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data)
      });
    }
  });
});

/*app.post("/purchase", (req, res) => {
  console.log("purchase item", req.body);
});*/
app.post("/purchase", function(req, res) {
  fs.readFile("./items.json", (error, data) => {
    if (error) {
      res.status(500).end();
    } else {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      req.body.items.forEach(item => {
        const itemJson = itemsArray.find(e => e.id == item.id);

        total = total + itemJson.price * item.quantity;
      });

      stripe.charges
        .create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: "usd"
        })
        .then(() => {
          res.json({ message: "Successfully purchased items" });
        })
        .catch(() => {
          res.json({ message: "Fail charging process" });
        });
    }
  });
});

/*app.get("/store", function(req, res) {
  res.sendFile("store.html", { root: __dirname + "/public" }); // for static without render
});*/

app.listen(3000);
