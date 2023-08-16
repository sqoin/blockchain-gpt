import React from 'react';
import "./SideBar.css";
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { BiConversation, BiTask } from "react-icons/bi"
import { FaRegEnvelope } from "react-icons/fa"
import { ImExit } from "react-icons/im"
import { CiSquareQuestion } from "react-icons/ci"
import { AiOutlineBarChart, AiOutlineInfoCircle } from "react-icons/ai"
import DropdownMenu from '../DropDownMenu/DropDownMenu';

const SideBar: React.FC<{ remaining: number , imageUpdated:boolean}> = ({ remaining,imageUpdated }) => {

  const [currentWindow, setCurrentWindow] = useState(window.location.pathname);
  const [showMenu, setShowMenu] = useState(false);

  const handleMainButtonClick = () => {
    setShowMenu(!showMenu);
  };


  function redirectToAccDetails() {
    window.location.href = "/accountdetails";
    setCurrentWindow("/accountdetails");
  }
  function redirectToTasks() {
    window.location.href = "/repetitivetasks";
    setCurrentWindow("/repetitivetasks");
  }

  const history = useHistory();



  async function logoutClicked() {
      
    // await signOut();
    // window.location.href = "/auth";
  }

  const toStatistic = () => {
    window.location.href = "/statistics";
    setCurrentWindow("/statistics")
  };

  const toChat = () => {
    window.location.href = "/";
    setCurrentWindow("/")
  };


  return (
    <div className="sidebar">
      <div className="chats">
        <button className="sidebar-btn add-chat" style={{ backgroundColor: currentWindow === "/" ? "#73648A" : "" }} onClick={toChat}><span className="icons">+</span>New chat</button>
      </div>
      <div className="options">
        <p className="sidebar-text"><span className="icons"><CiSquareQuestion /></span>Remaining Requests: {remaining}</p>
        <p className="sidebar-text"><span className="icons"><FaRegEnvelope /></span>exemple@gmail.com</p>
        <button className="sidebar-btn"
          style={{ backgroundColor: currentWindow === "/repetitivetasks" ? "#73648A" : "" }}
          onClick={redirectToTasks}>
          <span className="icons"><BiTask /></span>
          Repetitive Tasks
        </button>
        <button className="sidebar-btn" style={{ backgroundColor: currentWindow === "/accountdetails" ? "#73648A" : "" }} onClick={redirectToAccDetails}><span className="icons"><AiOutlineInfoCircle /></span>Account details</button>
        <button className="sidebar-btn" style={{ backgroundColor: currentWindow === "/statistic" ? "#73648A" : "" }} onClick={toStatistic}><span className="icons"><AiOutlineBarChart /></span>Statistic</button>
        <DropdownMenu onLogout={logoutClicked} onAccountDetails={redirectToAccDetails} imageUpdated={imageUpdated}/>
      </div>
    </div>

  );
};

export default SideBar;
