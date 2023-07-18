import React from 'react';
import "./SideBar.css";
import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { BiConversation } from "react-icons/bi"
import { FaRegEnvelope } from "react-icons/fa"
import { ImExit } from "react-icons/im"
import { CiSquareQuestion } from "react-icons/ci"
import { AiOutlineInfoCircle } from "react-icons/ai"

const SideBar: React.FC<{ remaining: number }> = ({ remaining }) => {

  function redirectToAccDetails() {
    // window.open(SERVER_DOMAIN+"/accountdetails","_blank")
    history.push("/accountdetails");
  }

  const history = useHistory();

  async function logoutClicked() {
    await signOut();
    history.push("/auth");
  }


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
        <button className="sidebar-btn" onClick={redirectToAccDetails}><span className="icons"><AiOutlineInfoCircle/></span>Account details</button>
        <button className="sidebar-btn signout" onClick={logoutClicked}><span className="icons"><ImExit/></span>Sign out</button>
      </div>
    </div>
    
  );
};

export default SideBar;
