import React, { useState } from "react";
import { Modal } from "reactstrap";
import "./WalletModal.css";
import { useHistory } from "react-router-dom";

export default function CrypoCurrencyPaymentModal({ isOpen, toggle }: any) {
  const history = useHistory();
  const toMetamask = () => {
    history.push("/paywithmetamask");
  };

  const toPhantom = () => {
    history.push("/paywithphantom");
  };

  function closeToggle() {
    toggle();
  }

  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer"
      >
        <h1 className="title">Choose your method of payment</h1>
        <div className="btns">
          <button className="metamask-btn" onClick={toMetamask}>
            <span>Pay with METAMASK</span>
          </button>
          <button className="phantom-btn" onClick={toPhantom}>
            <span>Pay with PHANTOM</span>
          </button>
          <button className="close-btn" onClick={closeToggle}>
            <span>Close</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
