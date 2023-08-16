import React, { useEffect } from 'react';
import "./SideBar.css";
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { BiConversation,BiTask } from "react-icons/bi"
import { FaHistory } from 'react-icons/fa';
import { FaRegEnvelope } from "react-icons/fa"
import { ImExit } from "react-icons/im"
import { CiSquareQuestion } from "react-icons/ci"
import {AiOutlineBarChart, AiOutlineInfoCircle } from "react-icons/ai"
import Hamburger from 'hamburger-react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';
import axios from 'axios';
import DropdownMenu from '../DropDownMenu/DropDownMenu';

const SideBar: React.FC<{ remaining: number , disabled: boolean}> = ({ remaining , disabled}) => {


  const [currentWindow, setCurrentWindow] = useState(window.location.pathname);
  const [showMenu, setShowMenu] = useState(false);

  const handleMainButtonClick = () => {
    setShowMenu(!showMenu);
  };


  const session=useSessionContext();
 // const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  let userId :any =null;
  if(!session.loading){
    userId = session.userId;
  }

  
  const getEmail =async (id: string) => {
    
  console.log("user id is: "+id)

  try{
    let url = ACCOUNT_MANAGEMENT+'/api/getUserById/'+id;
  const response = await axios.get(url);
  
  setUserEmail(response.data.email);
  }catch(error){
    console.log(error)
  }
  }
  
  useEffect(() => {
    
    if(userId){
      getEmail(userId);
    }
      
    
  }, [userId]);




  function redirectToAccDetails() {
    // window.open(SERVER_DOMAIN+"/accountdetails","_blank")
    history.push("/accountdetails");
    setCurrentWindow("/accountdetails");
  }
  function redirectToTasks() {
    // window.open(SERVER_DOMAIN+"/accountdetails","_blank")
    history.push("/repetitivetasks");
    setCurrentWindow("/repetitivetasks");
  }
  function redirectToHistory() {
    // window.open(SERVER_DOMAIN+"/accountdetails","_blank")
    history.push("/history");
    setCurrentWindow("/history");
  }

  const history = useHistory();



  async function logoutClicked() {
    await signOut();
    history.push("/auth");
  }

  const toStatistic = () => {
    history.push("/statistics");
    setCurrentWindow("/statistics")
  };

  const toChat = () => {
    history.push("/");
    setCurrentWindow("/")
  };

  if (disabled){
    return null;
  }


  return (
    <div className="sidebar">
      <div className="chats">
        
        <button className="sidebar-btn add-chat" style={{backgroundColor:currentWindow === "/" ? "#73648A" : ""}} onClick={toChat}><span className="icons">+</span>New chat</button>
      </div>
      <div className="options">
        <p className="sidebar-text"><span className="icons"><CiSquareQuestion/></span>Remaining Requests: {remaining}</p>
        <p className="sidebar-text"><span className="icons"><FaRegEnvelope/></span>{userEmail}</p>
        <button className="sidebar-btn" 
                style={{backgroundColor:currentWindow === "/repetitivetasks" ? "#73648A" : ""}} 
                onClick={redirectToTasks}>
          <span className="icons"><BiTask/></span>
          Repetitive Tasks
        </button>
        <button className="sidebar-btn" style={{backgroundColor:currentWindow === "/history" ? "#73648A" : ""}} onClick={redirectToHistory}><span className="icons"><FaHistory/></span>History</button>
        <button className="sidebar-btn" style={{backgroundColor:currentWindow === "/accountdetails" ? "#73648A" : ""}} onClick={redirectToAccDetails}><span className="icons"><AiOutlineInfoCircle/></span>Account details</button>
        <button className="sidebar-btn" style={{backgroundColor:currentWindow === "/statistic" ? "#73648A" : ""}} onClick={toStatistic}><span className="icons"><AiOutlineBarChart/></span>Statistic</button>
        {/* <button className="sidebar-btn signout" onClick={logoutClicked}><span className="icons"><ImExit/></span>Sign out</button> */}
        <DropdownMenu onLogout={logoutClicked} onAccountDetails={redirectToAccDetails}/>
      </div>
    </div>

  );
};

export default SideBar;
