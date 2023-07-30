import React from 'react';
import "./SideBar.css";
import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { BiConversation,BiTask } from "react-icons/bi"
import { FaRegEnvelope } from "react-icons/fa"
import { ImExit } from "react-icons/im"
import { CiSquareQuestion } from "react-icons/ci"
import {AiOutlineBarChart, AiOutlineInfoCircle } from "react-icons/ai"

const SideBar: React.FC<{ remaining: number }> = ({ remaining }) => {

  function redirectToAccDetails() {
    // window.open(SERVER_DOMAIN+"/accountdetails","_blank")
    history.push("/accountdetails");
  }
  function redirectToTasks() {
    // window.open(SERVER_DOMAIN+"/accountdetails","_blank")
    history.push("/repetitivetasks");
  }

  const history = useHistory();

  async function logoutClicked() {
    await signOut();
    history.push("/auth");
  }

  const toStatistic = () => {
    history.push("/statistic");
  };


  return (
    <div className="sidebar">
      <div className="chats">
        <button className="sidebar-btn add-chat"><span className="icons">+</span>New chat</button>
        <button className="sidebar-btn"><span className="icons"><BiConversation/></span>Chat 1</button>
        <button className="sidebar-btn"><span className="icons"><BiConversation/></span>Chat 2</button>
        <button className="sidebar-btn"><span className="icons"><BiConversation/></span>Chat 3</button>
        <button className="sidebar-btn"><span className="icons"><BiConversation/></span>Chat 4</button>
      </div>
      <div className="options">
        <p className="sidebar-text"><span className="icons"><CiSquareQuestion/></span>Remaining Requests: {remaining}</p>
        <p className="sidebar-text"><span className="icons"><FaRegEnvelope/></span>exemple@gmail.com</p>
        <button className="sidebar-btn" onClick={redirectToTasks}><span className="icons"><BiTask/></span>Repetitive Tasks</button>
        <button className="sidebar-btn" onClick={redirectToAccDetails}><span className="icons"><AiOutlineInfoCircle/></span>Account details</button>
        <button className="sidebar-btn" onClick={toStatistic}><span className="icons"><AiOutlineBarChart/></span>Statistic</button>
        <button className="sidebar-btn signout" onClick={logoutClicked}><span className="icons"><ImExit/></span>Sign out</button>
      </div>
    </div>
    
  );
};

export default SideBar;
