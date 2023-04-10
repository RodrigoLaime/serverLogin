const express = require('express');
const SchemaCustomer = require('../models/customerSchema');
const auth = require('../middleware/auth');
const router = express.Router();

//crear un cliente, pero solo si estamos logueados
router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const newCustomer = new SchemaCustomer({ name });
        const savedCustomer = await newCustomer.save();

        res.json(savedCustomer);

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.get('/',auth,async (req, res) => {
    try {
        //encuentra todos los clientes y los devuelve en formato json
        const customer = await SchemaCustomer.find();
        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    } 
})

module.exports = router;