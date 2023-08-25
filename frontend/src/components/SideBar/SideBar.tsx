import React, { useEffect } from 'react';
import "./SideBar.css";
import { useState, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { BiConversation, BiTask } from "react-icons/bi"
import { FaHistory } from 'react-icons/fa';
import { FaRegEnvelope } from "react-icons/fa"
import { ImExit } from "react-icons/im"
import { MdClose } from 'react-icons/md';
import { CiSquareQuestion } from "react-icons/ci"
import { AiOutlineBarChart, AiOutlineInfoCircle } from "react-icons/ai"
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';
import axios from 'axios';
import DropdownMenu from '../DropDownMenu/DropDownMenu';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  imageUpdated: boolean;
}

const SideBar: React.FC<SidebarProps> = ({ isOpen, onClose, remaining, imageUpdated }) => {
  const currentWindow = window.location.pathname;
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

  const history = useHistory();

  const redirectToAccDetails = useCallback(() => {
    history.push("/accountdetails");
  }, []);

  const redirectToTasks = useCallback(() => {
    history.push("/repetitivetasks");
  }, []);

  const redirectToHistory = useCallback(() => {
    history.push("/history");
  }, []);

  const logoutClicked = useCallback(async () => {
    await signOut();
    history.push("/auth");
  }, []);

  const toStatistic = useCallback(() => {
    history.push("/statistics");
  }, []);

  const toChat = useCallback(() => {
    history.push("/");
  }, []);

  const shouldHideSidebar = window.innerWidth <= 768 || window.navigator.userAgent.toLowerCase().includes('mobi');

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && shouldHideSidebar) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, onClose,shouldHideSidebar]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      
      <div className="chats">
      {isOpen && shouldHideSidebar && (
        <button className="close-button" onClick={onClose}>
          <MdClose />
        </button>
      )}
      <button
        className={`${
          isOpen ? "sidebar-btn-re chat " : " sidebar-btn add-chat"
        }`}
        style={{ backgroundColor: currentWindow === "/" ? "#73648A" : "" }}
        onClick={toChat}
      >
        <span 
        className={`${
          isOpen ? "icon" : "icons"
        }`}>+</span>
        {isOpen ? "New chat" : "New chat"}
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