const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, require: true },
})

const Customer = mongoose.model('customers', customerSchema);

module.exports = Customer;