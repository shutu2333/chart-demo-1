import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Chart from './Chart';
// import {PolarChart} from './Charts';
import registerServiceWorker from './registerServiceWorker';
// import {PolarChart} from './ChartView';
import {Shell} from './framework';
import {Flex} from './framework';
import PolarChart from './PolarChart2';
import {SampleChart} from './ChartView';
import {AdvancedChart} from './ChartView';
import {NewChart} from './ChartView';
//import Dataset from './dataProcess/_datasets.json';

ReactDOM.render(
    <Shell>
        <NewChart />
    </Shell>
, document.getElementById('root'));
registerServiceWorker();
