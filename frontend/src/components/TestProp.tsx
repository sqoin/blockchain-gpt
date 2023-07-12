import React, { useState } from "react";
import WalletModel from "./WalletModal";
import "./TestProp.css";
const TestProp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSendReport = () => setIsOpen(false);
  const onClick = () => setIsOpen(true);
  return (
    <div className="testProp">
      <button onClick={onClick}>click here</button>
      <WalletModel isOpen={isOpen} toggle={toggleSendReport} />
    </div>
  );
};

export default TestProp;
