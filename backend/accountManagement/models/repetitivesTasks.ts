import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  task: { type: String, required: true },
  duration:{ type: Number , required: true,min: 0 },
  status: {type:Boolean ,required: true }
});

const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;
