import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  task: { type: String, required: true },
  duration:{ type: Number , required: true },
  stopped:{ type: Boolean ,required: true ,default: true },
});

const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;
