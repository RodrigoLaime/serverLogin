const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SchemaUser = require('../models/userSchema');

// register
router.post('/', async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;
    if (!email || !password || !passwordVerify)
      return res.status(400).json({
        errorMessage: "Please enter all required fields."
      });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter  a password of at lieast 6 characters."
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Please enter  the same password twice."
      });
    // si el objeto tiene el mismo nombre eje: email: email, se puede color 1  
    const existinUser = await SchemaUser.findOne({ email });
    if (existinUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists."
      });
    //ecriptar contraseña
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt)

    //una ves completa los campos guardar los datos
    //copy the schema
    const newUser = new SchemaUser({
      email,
      passwordHash
    })
    //guardar en la DB
    const saveUser = await newUser.save();

    //sign the token
    const token = jwt.sign({
      user: saveUser._id
    }, process.env.JWT_SECRET);
    //send the token in a  HTTP-only cookie
    //la cookie sólo se puede leer en el servidor, no en el navegador del usuario
    res.cookie("token", token, {
      httpOnly: true,
      //para el https
      secure: true,
      sameSite: "none"
    })
      .send();

  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({
        errorMessage: "Please enter all required fields."
      });
    const existinUser = await SchemaUser.findOne({ email });
    if (!existinUser)
      return res.status(401).json({
        errorMessage: "wrong email or password."
      });
    //comparar contraseña
    const passwordCorrect = await bcrypt.compare(password, existinUser.passwordHash);
    if (!passwordCorrect)
      return res.status(401).json({
        errorMessage: "wrong email or password."
      });

    //sign the token
    const token = jwt.sign({
      user: existinUser._id
    }, process.env.JWT_SECRET);
    //send the token in a  HTTP-only cookie
    //la cookie sólo se puede leer en el servidor, no en el navegador del usuario
    res.cookie("token", token, {
      httpOnly: true,
      //para el https
      secure: true,
      sameSite: "none"
    }).send();



  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

//logout
router.get('/logout', (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      //para el https
      secure: true,
      sameSite: "none"
    }).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
})

//no me quedo claro
router.get('/loggedIn', (req, res) => {
  try {
    //obtener el token de la cookie(manera de obtener info desde la cookie)
    const token = (req.cookies.token);
    //si no hay tocken la respuesta es falsa
    if (!token)
      return res.json(false);

    //verificar el tocken, si el tocken no se a creado con esa contrasña error
    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);

  } catch (error) {
    res.json(false);
  }
})
module.exports = router