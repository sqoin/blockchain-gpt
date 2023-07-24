import React, { useState, useEffect } from 'react';
import "./RepetitiveTasks.css";
import axios from 'axios';

interface Task {
    _id: string;
    userId: string;
    task: string;
    duration: number;
}

const RepetitiveTasks: React.FC<{ userId: string }> = ({ userId }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasksByUserId = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/api//tasks/${userId}`);
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasksByUserId();
    }, [userId])

    const convertMillisecondsToMinutes = (milliseconds: number): number => {
        return Math.floor(milliseconds / 60000);
      };


    return (
        <div className='repetitiveTasks'>
            <h1 className='title'>Repetitive Tasks</h1>
            <div className="tbl-header">
                <table  cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className="tbl-content">
                <table cellPadding="0" cellSpacing="0" >
                    <tbody>

                        {tasks.map((task) => (
                            <tr key={task._id}>
                                <td >
                                    {task.task}
                                </td>
                                <td >
                                    {convertMillisecondsToMinutes(task.duration)} min
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default RepetitiveTasks;
