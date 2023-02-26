// sk_test_51MdaQqSJXxZpup4P0rHxj4ZfjvcXVSpL2Bht82knp9wrzER6sbCMqJ97yyEIvn4nQvsVL7fj5Z56bE2tOuhQUBm4004K3epGfv

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  /*
    req.body.items
    [
        {
            id: 1,
            quantity: 3
        }
    ]
    stripe wants
    [
        {
            price: 1,
            quantity: 3
        }
    ]
    */
  console.log(req.body);
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(4000, () => console.log("Listening on port 4000!"));
