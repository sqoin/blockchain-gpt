import React, { useState, useEffect } from 'react';
import "./RepetitiveTasks.css";
import axios from 'axios';
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen,faSave } from '@fortawesome/free-solid-svg-icons';



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
  const [showInput, setShowInput] = useState(false);
   const [itemMap, setItemMap] = useState<{ [key: string]: boolean }>({});
  const [newDuration, setNewDuration] = useState(0);
  

   const fetchTasksByUserId = async () => {
        if (sessionContext.loading === true) {
            return null;
        }
        console.log(sessionContext?.userId)
        setUserId(sessionContext?.userId.toString())
        try {
            const response = await axios.get(`${ACCOUNT_MANAGEMENT}/api/tasks/${sessionContext.userId}`);
            setTasks(response.data);
       
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
          console.log(response.data); 
          fetchTasksByUserId(); 
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      };
      
  
      const updateTaskDuration = async (taskId:any, newDuration:any, userId:any) => {
        try {
          const url = `${ACCOUNT_MANAGEMENT}/api/tasks/upduration`;
          const requestData = { taskId: taskId, userId: userId, newDuration: newDuration };
          await axios.put(url, requestData);
          await fetchTasksByUserId()
          console.log(`Task ${taskId} duration updated to ${newDuration}`);
           setItemMap((prevItemMap) => ({
          ...prevItemMap,
          [taskId]: false,
          }));
          
        } catch (error) {
          console.error(`Error updating task ${taskId} duration:`, error);
        }
      };
      
    
    const handleDurationChange = (e:any) => {
      const value = parseInt(e.target.value);
      setNewDuration(value);
    };
  
    
  
    const handleEditClick = (taskId:any) => {
  
      setItemMap((prevItemMap) => ({
      ...prevItemMap,
      [taskId]: true,
      }));
      setShowInput(true);
    };
  
    const handleUpdateClick = () => {
      setShowInput(false);
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
                             
                                <td>
                                <div>
                                  {itemMap[task._id] ? (
                                    <div>
                                    <p className='span'>La durée en millisecondes</p>
                                    <div className='input-container'>
                                      <input type='number' className='input' onChange={handleDurationChange} />
                                      <FontAwesomeIcon
                                        icon={faSave}
                                        className='saveIcon'
                                        onClick={() => {
                                          updateTaskDuration(task._id, newDuration, userId);
                                          handleUpdateClick();
                                        }}
                                      />
                                    </div>
                                    </div>

                                  ) : (
                                    <div>
                                      <span>{formatDuration(task.duration)}</span>
                                      <FontAwesomeIcon
                                        icon={faPen}
                                        onClick={() => handleEditClick(task._id)}
                                        className='editIcon'
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>

                                


                                <td >
                                {/* <span >{task.status}</span> */}
                                
                                {task.status === false&& (
                                    <button onClick={() => { handleUpdateTask(task._id); }} className=" common-button button-1">
                                    Stop
                                    </button>
                                   
                                )}
                                 {(task.status === undefined || task.status === true ) && (
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

