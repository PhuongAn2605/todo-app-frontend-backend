const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, required: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);