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
    const [showModal, setShowModal] = useState(false);
    const [editedDuration, setEditedDuration] = useState('');
    const [editingTaskId, setEditingTaskId] = useState('');
    

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

      function formatDuration(milliseconds:number) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
      
        if (hours > 0) {
          return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
          return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
          return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }
      }
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
      
      const updateTaskDuration = async (taskId:any, newDuration:any) => {
        try {
          const userId = "yourUserId"; 
      
          const object = { "userId": userId, "taskId": taskId, "newDuration": newDuration };
          const url = `${ACCOUNT_MANAGEMENT}/api/tasks/upduration`;
      
          const response = await axios.put(url, object);
      
          if (response.status === 200) {
            console.log('Task duration updated successfully:', response.data);
            fetchTasksByUserId()
            } else {
            console.log('Unexpected response status:', response.status);
          }
        } catch (error) {
          console.error('Error updating task duration:', error);
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
                                    {formatDuration(task.duration)}
                                    
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
                                 
                                <button
                                  onClick={() => {
                                    setEditingTaskId(task._id);
                                    setShowModal(true);
                                    setEditedDuration(task.duration);
                                  }}>
                                  Update Duration
                                </button>
                                </td>
                            </tr>
                        ))}
                        {showModal && (
                          <div className="modal">
                            <div className="modal-content">
                              <h2>Modifier la durée de la tâche</h2>
                              <p>Saisissez la nouvelle durée en millisecondes :</p>
                              <input
                                type="text"
                                value={editedDuration}
                                onChange={(e) => setEditedDuration(e.target.value)}
                              />
                              <button onClick={() => updateTaskDuration(editingTaskId, editedDuration)}>Valider</button>
                              <button onClick={() => setShowModal(false)}>Annuler</button>
                            </div>
                          </div>
                        )}
                    </tbody>
                </table>
               
            </div>
        </div>

    );
};

export default RepetitiveTasks;

