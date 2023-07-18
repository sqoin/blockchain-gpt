import { useHistory } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import React, { useEffect, useState } from "react";
import {
  BlogsIcon,
  CelebrateIcon,
  GuideIcon,
  SeparatorLine,
  SignOutIcon,
} from "../assets/images";
import Terminal from "../components/Terminal"
import axios from "axios";

interface ILink {
  name: string;
  onClick: () => void;
  icon: string;
}

export default function SuccessView(props: { userId: string }) {
  let userId = props.userId;

  const history = useHistory();

  
  useEffect(() => {
    sendUserIdToBackend();
  }, [])


  async function sendUserIdToBackend() {
  try {
    const response = await axios.post('http://localhost:3003/api/saveUserId', { userId });
    if (response.data && response.data.message) {
      history.push("/paymentmode") // Display the alert message from the backend response
    }
    console.log('User ID sent to the backend successfully!');
  } catch (error) {
    console.error('Error sending user ID to the backend:', error);
  }
}


  async function logoutClicked() {
    await signOut();
    history.push("/auth");
  }

  function openLink(url: string) {
    window.open(url, "_blank");
  }

  const links: ILink[] = [
    {
      name: "Sign Out",
      onClick: logoutClicked,
      icon: SignOutIcon,
    },
  ];

  return (
    <>
      <div className="main-container">
        <Terminal></Terminal>
      </div>

      {/* <div className="bottom-links-container">
        {links.map((link) => (
          <div className="link" key={link.name}>
            <img className="link-icon" src={link.icon} alt={link.name} />
            <div role={"button"} onClick={link.onClick}>
              {link.name}
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
}


