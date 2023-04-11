const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));
/* app.use(cors()); */
dotenv.config();

// connection router
app.use('/auth', require('./routers/userRouter'));
app.use('/customer', require('./routers/customerRouter'));

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
