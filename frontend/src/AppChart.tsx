import React from 'react';
import ReactDOM from 'react-dom';
/// @ts-ignore
import BitcoinChart from './charts.tsx';
//const BitcoinChart = require('./charts.tsx');
/// @ts-ignore

import PieChart from './piecharts.tsx';


const AppChart: React.FC = () => {
  return (
    <div>
      <BitcoinChart/>
    </div>
  );
};

ReactDOM.render(<AppChart />, document.getElementById('root'));
export default AppChart;