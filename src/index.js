const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const nocache = require("nocache");
const {
  validateAccessToken,
} = require("./middleware/auth0.middleware");
const { messagesRouter } = require("./messages/messages.router");

const routes = require('./routes');
const mongoose = require("mongoose")
const { errorHandler } = require("./middleware/error.middleware");
const { notFoundHandler } = require("./middleware/not-found.middleware");

dotenv.config();


// Database Set Up
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err)=> {console.error('ERROR! - ' + err.message)});
db.on('connected', ()=>{console.info(`Connected to - ${db.host} : ${db.port}`)});
db.on('disconnected', ()=>{console.info('disconnected from mongoDB')});

if (!(process.env.PORT && process.env.CLIENT_ORIGIN_URL)) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}


const PORT = parseInt(process.env.PORT, 10);
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const app = express();
const apiRouter = express.Router();



app.use(express.json());
app.set("json spaces", 2);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: {
      action: "deny",
    },
  })
);

app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
app.use(nocache());



const whitelist = [`${CLIENT_ORIGIN_URL}`, 'https://localhost:3000', 'http://localhost:3000'];
const corsOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
  maxAge: 86400,
  origin: (origin, callback) => {
    // console.log(origin);
    if ((whitelist.indexOf(origin) !== -1) || (!origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));


app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
// app.use("/example", exampleRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/user", routes.user);
apiRouter.use("/material", routes.material);
apiRouter.use("/message", routes.message);


app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});

