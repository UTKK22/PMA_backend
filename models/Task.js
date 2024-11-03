const mongoose = require('mongoose');
const { Schema } = mongoose;

// Defining the checklist schema
const checklistSchema = new Schema({
    text: { type: String, required: true },
    isChecked: { type: Boolean, required: true, default: false },
});

// Defining the main task schema
const TaskSchema = new Schema(
    {
        title: { type: String, required: true },
        priority: {
            type: String,
            required: true,
            enum: ['low', 'moderate', 'high'],
        },
        dueDate: { type: Date , required: false},
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        checklist: [checklistSchema],
        status: {
            type: String,
            required: true,
            enum: ['backlog', 'todo', 'in-progress', 'done'],
            default: 'todo',
        },
        assignee:{
            type:String,
            required:false
        },
    },
    { timestamps: true }
);

// Create and export the Task model
const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;
