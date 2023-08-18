import React, { useEffect } from 'react';
import "./SideBar.css";
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { BiConversation, BiTask } from "react-icons/bi"
import { FaHistory } from 'react-icons/fa';
import { FaRegEnvelope } from "react-icons/fa"
import { ImExit } from "react-icons/im"
import { CiSquareQuestion } from "react-icons/ci"
import { AiOutlineBarChart, AiOutlineInfoCircle } from "react-icons/ai"
import Hamburger from 'hamburger-react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';
import axios from 'axios';
import DropdownMenu from '../DropDownMenu/DropDownMenu';

const SideBar: React.FC<{ remaining: number, imageUpdated: boolean }> = ({ remaining, imageUpdated }) => {
  const [currentWindow, setCurrentWindow] = useState(window.location.pathname);
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory(); // Use the useHistory hook here

  const handleMainButtonClick = () => {
    setShowMenu(!showMenu);
  };

  const session = useSessionContext();
  const [userEmail, setUserEmail] = useState('');
  let userId: any = null;

  if (!session.loading) {
    userId = session.userId;
  }

  const getEmail = async (id: string) => {
    try {
      let url = ACCOUNT_MANAGEMENT + '/api/getUserById/' + id;
      const response = await axios.get(url);
      setUserEmail(response.data.email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getEmail(userId);
    }
  }, [userId]);

  function redirectToAccDetails() {
    history.push("/accountdetails"); // Use history.push for navigation
    setCurrentWindow("/accountdetails");
  }

  function redirectToTasks() {
    history.push("/repetitivetasks"); // Use history.push for navigation
    setCurrentWindow("/repetitivetasks");
  }

  function redirectToHistory() {
    history.push("/history"); // Use history.push for navigation
    setCurrentWindow("/history");
  }

  async function logoutClicked() {
    await signOut();
    history.push("/auth"); // Use history.push for navigation
  }

  const toStatistic = () => {
    history.push("/statistics"); // Use history.push for navigation
    setCurrentWindow("/statistics");
  };

  const toChat = () => {
    history.push("/"); // Use history.push for navigation
    setCurrentWindow("/");
  };

  return (
    <div className="sidebar">
      <div className="chats">
        <button className="sidebar-btn add-chat" style={{ backgroundColor: currentWindow === "/" ? "#73648A" : "" }} onClick={toChat}>
          <span className="icons">+</span>New chat
        </button>
      </div>
      <div className="options">
        <p className="sidebar-text"><span className="icons"><CiSquareQuestion /></span>Remaining Requests: {remaining}</p>
        <p className="sidebar-text"><span className="icons"><FaRegEnvelope /></span>{userEmail}</p>
        <button className="sidebar-btn"
          style={{ backgroundColor: currentWindow === "/repetitivetasks" ? "#73648A" : "" }}
          onClick={redirectToTasks}>
          <span className="icons"><BiTask /></span>
          Repetitive Tasks
        </button>
        <button className="sidebar-btn" style={{ backgroundColor: currentWindow === "/history" ? "#73648A" : "" }} onClick={redirectToHistory}>
          <span className="icons"><FaHistory /></span>History
        </button>
        <button className="sidebar-btn" style={{ backgroundColor: currentWindow === "/accountdetails" ? "#73648A" : "" }} onClick={redirectToAccDetails}>
          <span className="icons"><AiOutlineInfoCircle /></span>Account details
        </button>
        <button className="sidebar-btn" style={{ backgroundColor: currentWindow === "/statistics" ? "#73648A" : "" }} onClick={toStatistic}>
          <span className="icons"><AiOutlineBarChart /></span>Statistic
        </button>
        <DropdownMenu onLogout={logoutClicked} onAccountDetails={redirectToAccDetails} imageUpdated={imageUpdated} idUser={userId} />
      </div>
    </div>
  );
};

export default SideBar;
