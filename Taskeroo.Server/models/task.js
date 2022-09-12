const mongoose = require("mongoose");
const shortId = require("shortid");

const taskSchema = new mongoose.Schema({

    id: {
        type: String,
        require: true,
        default: shortId.generate()
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        require: false
    },

    personal: {
        type: Boolean,
        required: true
    },

    completed: {
        type: Boolean,
        require: true
    },

    date: {
        type: String,
        required: true 
    }

});
module.exports = mongoose.model("Task", taskSchema);