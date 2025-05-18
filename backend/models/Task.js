

const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

    completed: {
        type: Boolean,
        default: false,
    },
})

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },

    status: {
        type: String,
        enum: ["pending", "InProgress", "completed"],
        default: "pending",
    },

    dueDate: {
        type: Date,
        required: true,
    },

    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    attachment: [{
        type: String,
    }],

    todoCheckList: [todoSchema],

    progress: {
        type: Number,
        default: 0
    }
},

{timestamps: true}

)

module.exports = mongoose.model("Task", taskSchema);