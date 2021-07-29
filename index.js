const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema.js");
const graphqlResolvers = require("./graphql/resolver.js");
const auth = require("./middleware/auth.js");
const port = process.env.PORT || 4000;
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("graphql Api work in progress");
});

mongoose
  .connect(process.env.Atlas_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(port, () => console.log("connected"));
  })
  .catch((err) => console.log(err));
