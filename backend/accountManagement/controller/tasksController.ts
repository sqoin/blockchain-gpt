import { Request, Response } from "express";
import TaskModel from "../models/repetitivesTasks";


exports.createTask = async (req: Request, res: Response) => {
  try {
    const { userId, task, duration, status } = req.body;
    const newTask = new TaskModel({ userId, task, duration, status });
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
    const taskId = req.body.taskId;
    const userId= req.body.userId;

    console.log(taskId)
    const filter = {  "_id": taskId,userId: userId};
    const update = { status: "stopped" };


    const updatedTask = await TaskModel.findOneAndUpdate(filter, update, {
      new: true
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    } 

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to update task." });
  }
};
