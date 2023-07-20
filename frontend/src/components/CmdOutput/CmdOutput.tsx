import React from 'react';
import "./CmdOutput.css";

interface Output {
  input: string;
  command: string;
}

const CmdOutput: React.FC<{ oput: Output; index: any }> = ({ oput, index }) => {
  return (
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
  );
};



export default CmdOutput;
