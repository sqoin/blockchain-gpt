import React from 'react';
import {useHistory} from 'react-router-dom';

const MyButton: React.FC = () => {
const history = useHistory();

const handleClick = () => {
    history.push('/paymentmode');
};

return (
<button onClick={handleClick}>
  <span>BUY NOW</span>
 </button>
);
};

export default MyButton;