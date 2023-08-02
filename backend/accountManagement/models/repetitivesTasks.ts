import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  task: { type: String, required: true },
  duration:{ type: Number , required: true },
  status: {type: String,enum: ['stopped', ''],default: '',}
});

const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;
