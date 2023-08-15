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
    status: boolean;
}


const RepetitiveTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const sessionContext = useSessionContext();
    const [userId, setUserId] = useState("");


   const fetchTasksByUserId = async () => {
        if (sessionContext.loading === true) {
            return null;
        }
        console.log(sessionContext?.userId)
        setUserId(sessionContext?.userId.toString())
        try {
            const response = await axios.get(`${ACCOUNT_MANAGEMENT}/api/tasks/${sessionContext.userId}`);
            setTasks(response.data);
            // Extract the status from tasks and store it in a variable
        if (response.data.length > 0) {
            const taskStatus = response.data[0].status;
            // Now you can use 'taskStatus' variable as needed
        }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }
    useEffect(() => {
        fetchTasksByUserId();

    }, [userId])

    const convertMillisecondsToMinutes = (milliseconds: number): number => {
        return Math.floor(milliseconds / 60000);
      };

    const updateTaskStopped = async (taskId: any)  => {
      try {
        
        const object = { "userId":userId,"taskId":taskId};
        const url = `${ACCOUNT_MANAGEMENT}/api/tasks/stopTask`;
        const response = await axios.put(url, object);
      
        if (response.status === 200) {
            console.log('Task updated successfully:', response.data);
          } else {
            console.log('Unexpected response status:', response.status);
          }
        } catch (error) {
          console.error('Error updating task:', error);
        }
      };
      

      const handleUpdateTask = async (taskId: any) => {
        await updateTaskStopped(taskId);
        fetchTasksByUserId()
      };
      const handleDeleteTask = async (userId:any, taskId:any) => {
        try {
          const response = await axios.delete(`${ACCOUNT_MANAGEMENT}/api/tasks/${userId}/${taskId}`);
          console.log(response.data); // Assuming you want to log the response data
          fetchTasksByUserId(); // To refresh the task list
        } catch (error) {
          console.error('Error deleting task:', error);
        }
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
                            <th>Status</th> 
                            <th></th>

                        </tr>
                    </thead>
                </table>
            </div>
            <div className="tbl-content">
                <table className='task-table' cellPadding="0" cellSpacing="0" >
                    <tbody>

                        {tasks.map((task:any) => (
                            <tr key={task._id}>
                                <td >
                                    {task.task}
                                </td>
                                <td >
                                    {convertMillisecondsToMinutes(task.duration)} min
                                </td>
                                <td >
                                {/* <span >{task.status}</span> */}
                                
                                {task.status === false&& (
                                    <button onClick={() => { handleUpdateTask(task._id); }} className=" common-button button-1">
                                    Stop
                                    </button>
                                   
                                )}
                                 {(task.status == undefined || task.status === true ) && (
                                    <button onClick={() => { handleUpdateTask(task._id); }} className="common-button button-3">
                                    Restart
                                    </button>
                                   
                                )}
                                      
                                </td>
                                <td >
                                <button onClick={() => { handleDeleteTask (task.userId, task._id); }} className="common-button button-1">
                                    Delete
                                    </button>
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

