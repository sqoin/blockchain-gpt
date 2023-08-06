import React from 'react';
import "./SideBar.css";
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { BiConversation,BiTask } from "react-icons/bi"
import { FaRegEnvelope } from "react-icons/fa"
import { ImExit } from "react-icons/im"
import { CiSquareQuestion } from "react-icons/ci"
import {AiOutlineBarChart, AiOutlineInfoCircle } from "react-icons/ai"

const SideBar: React.FC<{ remaining: number }> = ({ remaining }) => {

  const [currentWindow, setCurrentWindow] = useState(window.location.pathname);

  

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


  return (
    <div className="sidebar">
      <div className="chats">
        <button className="sidebar-btn add-chat" style={{backgroundColor:currentWindow === "/" ? "#73648A" : ""}} onClick={toChat}><span className="icons">+</span>New chat</button>
      </div>
      <div className="options">
        <p className="sidebar-text"><span className="icons"><CiSquareQuestion/></span>Remaining Requests: {remaining}</p>
        <p className="sidebar-text"><span className="icons"><FaRegEnvelope/></span>exemple@gmail.com</p>
        <button className="sidebar-btn" 
                style={{backgroundColor:currentWindow === "/repetitivetasks" ? "#73648A" : ""}} 
                onClick={redirectToTasks}>
          <span className="icons"><BiTask/></span>
          Repetitive Tasks
        </button>
        <button className="sidebar-btn" style={{backgroundColor:currentWindow === "/accountdetails" ? "#73648A" : ""}} onClick={redirectToAccDetails}><span className="icons"><AiOutlineInfoCircle/></span>Account details</button>
        <button className="sidebar-btn" style={{backgroundColor:currentWindow === "/statistic" ? "#73648A" : ""}} onClick={toStatistic}><span className="icons"><AiOutlineBarChart/></span>Statistic</button>
        <button className="sidebar-btn signout" onClick={logoutClicked}><span className="icons"><ImExit/></span>Sign out</button>
      </div>
    </div>
    
  );
};

export default SideBar;
