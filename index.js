const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOption = {
  origin: [
    'http://localhost:3000',
    'https://main--gentle-taffy-cb9058.netlify.app/'
  ],
  /*   origin: '*', */
  credentials: true,
  /*   optionSuccessStatus: 200 */
}
app.use(cors(corsOption));
/* app.use(cors()); */
dotenv.config();

// connection router
app.use('/auth', require('./routers/userRouter'));
app.use('/customer', require('./routers/customerRouter'));

/* //midleware activq el cors para permitir peticion ajax y http desde el front 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Header', 'Authorization, X-API-KEY, Origin, X-Requested-With, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
}); */

// connection db
const user = process.env.DB_NAME
const key = process.env.DB_KEY
const url = `mongodb+srv://${user}:${key}@cluster0.kpp1aja.mongodb.net/Loginjwt`;
/* const url = `mongodb+srv://${user}:${key}@cluster0.kpp1aja.mongodb.net/?retryWrites=true&w=majority`; */
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB succes'))
  .catch(err => console.error(err));


//connection port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('server started on port:', PORT));
