import { Request, Response } from "express";
import TaskModel from "../repetitivesTasks";

exports.createTask = async (req: Request, res: Response) => {
  try {
    const { userId, task, duration } = req.body;
    const newTask = new TaskModel({ userId, task, duration });
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
