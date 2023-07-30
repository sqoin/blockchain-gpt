import React, { useState } from 'react';
import "./CmdOutput.css";
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi'

interface Output {
  input: string;
  command: string;
  error: string;
  eye:boolean;
}

const CmdOutput: React.FC<{ oput: Output; index: any}> = ({ oput, index }) => {
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  const toggle = () => {
    setIsEyeOpen(!isEyeOpen);
  }

  return (
    <div className="linus" style={{height: isEyeOpen? '100px': 'auto', alignItems: isEyeOpen? 'flex-start': 'center'}}>
      <div className="error">  
      <button onClick={toggle} className='eye'style={{display: oput.eye === true? 'flex': 'none'}}>{isEyeOpen?<PiEyeLight/>:<PiEyeClosedLight/>}</button>
      <p className='error-res' style={{display: isEyeOpen? 'block': 'none'}}>Error: {oput.error}</p>
      </div>
        <div className="command-line">
          {oput.input && (
            <div className="solana">
              {`>>>${oput.input}`}
            </div>
          )}
          {oput.command && (
            <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <div key={index}>
                {`${oput.command}`}
              </div>
            </div>
          )}
        </div>
    </div>
  );
};



export default CmdOutput;
