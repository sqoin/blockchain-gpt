import { Request, Response } from "express";
import TaskModel from "../models/repetitivesTasks";




exports.createTask = async (req: Request, res: Response) => {
  try {
    const { userId, task, duration,stopped } = req.body;
    const newTask = new TaskModel({ userId, task, duration,stopped });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

exports.getTasksByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const tasks = await TaskModel.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks by userId" });
  }
};

exports.updateTaskStopped = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const { stopped } = req.body;

    // Validate the value of 'stopped' (optional)
    if (typeof stopped !== 'boolean') {
      return res.status(400).json({ message: "Invalid 'stopped' value. It must be a boolean." });
    }

    // Find the task by its ID and update the 'stopped' field
    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { stopped }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task." });
  }
};
