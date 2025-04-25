const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minlength: 3,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        default: []
    },
    image: {
        type: String,
        required: true
    },
    Gst: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Owner", ownerSchema);
