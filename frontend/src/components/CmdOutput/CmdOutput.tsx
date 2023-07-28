import React, { useState } from 'react';
import "./CmdOutput.css";
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi'

interface Output {
  input: string;
  command: string;
}

const CmdOutput: React.FC<{ oput: Output; index: any; eye: boolean; error: string }> = ({ oput, index, eye, error }) => {
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  const toggle = () => {
    setIsEyeOpen(!isEyeOpen);
  }

  return (
    <div className="linus">
      <div className="error">  
      <button onClick={toggle} className='eye'style={{display: eye? 'flex': 'none'}}>{isEyeOpen?<PiEyeLight/>:<PiEyeClosedLight/>}</button>
      <p className='error-res' style={{display: isEyeOpen? 'block': 'none'}}>{error}</p>
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
