import React, { useState, useEffect } from 'react';
import "./RepetitiveTasks.css";
import axios from 'axios';
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';

interface Task {
    _id: string;
    userId: string;
    task: string;
    duration: number;
}

const RepetitiveTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const sessionContext = useSessionContext();

    
    const fetchTasksByUserId = async () => {
        if (sessionContext.loading === true) {
            return null;
        }
        try {
            const response = await axios.get(`${ACCOUNT_MANAGEMENT}/api/tasks/${sessionContext.userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }
    useEffect(() => {
        fetchTasksByUserId();
    }, [])

    const convertMillisecondsToMinutes = (milliseconds: number): number => {
        return Math.floor(milliseconds / 60000);
      };


    return (
        <div className='repetitiveTasks'>
            <h1 className='title'>Repetitive Tasks</h1>
            <div className="tbl-header">
                <table className='task-table' cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className="tbl-content">
                <table className='task-table' cellPadding="0" cellSpacing="0" >
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
