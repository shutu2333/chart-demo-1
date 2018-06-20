import React, { Component } from 'react'
// import { scaleLinear as linear } from 'd3-scale'
// import { voronoi } from 'd3-voronoi'

import { Radar, Polar } from '../ChartComponent';


// import {
//   VictoryChart,
//   VictoryStack,
//   VictoryBar,
//   VictoryAxis,
//   VictoryLabel,
//   VictoryPolarAxis,
//   VictoryContainer,
//   VictoryTheme,
//   VictoryVoronoiContainer,
//   VictoryGroup
  
// } from 'victory'

import {
  flow,
  entries,
  map,
  reduce,
  round,
  range,
  random,
  sortBy,
  sortedUniq,
  compact,
  thru,
} from 'lodash/fp'


function HumanNumber(number,n){
    return `${(number/1000).toFixed(n)} K`
}

// example data sets
const gi={
    M:{
        count:3081,
        countImpact:random(2260, 2270)
    },
    F:{
        count:2247,
        countImpact:random(1640,1650)
    }
};
const data = [
    [
      {
        x: 'M',
        y: gi.M.count - gi.M.countImpact,
        y0: 0,
        label: '',
        header: 'Males',
        subhead: 'Not Impacted',
        value: `FTE ${ HumanNumber(gi.M.count - gi.M.countImpact, 2) } (${ ((gi.M.count - gi.M.countImpact) / gi.M.count * 100).toFixed(2) }% )`,
      },
      {
        x: 'F',
        y: gi.F.count - gi.F.countImpact,
        y0: 0,
        label: '',
        header: 'Females',
        subhead: 'Not Impacted',
        value: `FTE ${ HumanNumber(gi.F.count - gi.F.countImpact, 2) } (${ ((gi.F.count - gi.F.countImpact) / gi.F.count * 100).toFixed(2) }% )`,
      },
    ],
    [
      {
        x: 'M',
        y: gi.M.countImpact,
        y0: gi.M.count - gi.M.countImpact,
        label: '',
        header: 'Males',
        subhead: 'Impacted',
        value: `FTE ${ HumanNumber(gi.M.countImpact, 2) } (${ (gi.M.countImpact / gi.M.count * 100).toFixed(2) }% )`,
      },
      {
        x: 'F',
        y: gi.F.countImpact,
        y0: gi.F.count - gi.F.countImpact,
        label: '',
        header: 'Females',
        subhead: 'Impacted',
        value: `FTE ${ HumanNumber(gi.F.countImpact, 2) } (${ (gi.F.countImpact / gi.F.count * 100).toFixed(2) }% )`,
      },
    ],
  ];




const fakeData = {
  datasets: [{
    data: [
      11,
      16,
      7,
      3,
      14
    ],
    backgroundColor: [
      '#FF6384',
      '#4BC0C0',
      '#FFCE56',
      '#E7E9ED',
      '#36A2EB'
    ],
    label: 'My dataset' // for legend
  }],
  labels: [
    'Red',
    'Green',
    'Yellow',
    'Grey',
    'Blue'
  ]
};


const fakeData1 = {
  datasets: [{
    label: 'female',
    backgroundColor: 'rgba(179,181,198,0.2)',
    borderColor: '#faa61a',
    pointBackgroundColor: 'rgba(179,181,198,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(179,181,198,1)',
    data: [90,10],
    type: 'polarArea'
  }, 
  {
    label: 'male',
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    pointBackgroundColor: 'rgba(255,99,132,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(255,99,132,1)',
    data: [70, 30],
    //Changes this dataset to become another polar
    type: 'polarArea'
  }
],
  labels: ['uni', 'in']
}


  // function fillColor(d, i) {
  //   if (d.x === 'F') {
  //     // eslint-disable-next-line css-modules/no-undef-class
  //     return i ? styles.primaryColor : styles.lightOrange
  //   }
  //   // eslint-disable-next-line css-modules/no-undef-class
  //   return i ? styles.lighterGray : styles.lightGray2
  // }

// const dataPro4 =flow(
//     //map(v=>v.name),
//     // sortBy(v=>v.level),
//     // sortedUniq,
//     // compact,
//     map(value => ({x:value.id, y:value.value})),
// )(data2);

// const fakeData = {
//   labels: ['Advanced Materials', 'Fixed Robotic', 'Mobile Robotics', 'Process AI', 'Social AI'],
//   datasets: [
//     {
//       label: 'FEMALE',
//       backgroundColor: 'rgba(179,181,198,0.2)',
//       borderColor: '#faa61a',
//       pointBackgroundColor: 'rgba(179,181,198,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(179,181,198,1)',
//       data: [65, 59, 90, 81, 56]
//     },
//     {
//       label: 'MALE',
//       backgroundColor: 'rgba(255,99,132,0.2)',
//       borderColor: 'rgba(255,99,132,1)',
//       pointBackgroundColor: 'rgba(255,99,132,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(255,99,132,1)',
//       data: [28, 48, 40, 19, 96]
//     }
//   ]
// };








  export default class PolarChart extends Component{
    constructor(props) {
        super(props);
        this.state = {
        //   chartData: {
        //       male: [],
        //       female: []
        //   },
          isFilterChanged: false,
          isLoading: false
        };
        //this.handleClick = this.handleClick.bind(this);
      }
    // componentWillMount(){
    //     this.setState({
    //       chartData: {
    //         male:dataPro1,
    //         female:dataPro2,
    //       },
    //       isDataOne: true
    //     });
    // }

    componentDidMount(){

        // this.setState({
        //     chartData: 
        //     {
        //         male:dataPro1,
        //         female:dataPro2
        //     },
        //     isDataOne: true,
        //     isLoading: false
   
        // });
    }

    // handleClick(){
        
    // this.setState({
    //     isLoading:true
    // });
    //     if(this.state.isDataOne){
    //         this.setState({
    //             chartData: 
    //             {
    //                 male:dataPro3,
    //                 female:dataPro4
    //             },
    //             isDataOne: false,
    //             isLoading: false
    //         });
    //     }else{
    //         this.setState({
    //             chartData: 
    //             {
    //                 male:dataPro1,
    //                 female:dataPro2
    //             },
    //             isDataOne: true,
    //             isLoading: false
    //         });
    //     }
        

    // }

    addMyRef(ref){
        this.myRefs = ref;
        
    }
      render(){
          console.log(data);

        return (
            this.state.isLoading? <h1>Loading</h1> : 
            <div>
              <div>
                {/* <h2>Chart</h2> */}
                <Radar data={fakeData} />
                <Polar 
                data={fakeData1} 
                options={{
                  title: {
                      position: 'top',
                      display: true,
                      text: 'Human Capital Impact',
                      fontColor: '#EBEBED',
                      fontStyle: 'normal',
                      fontSize: 20

                  },

                  tooltips: {
                    mode: 'nearest',
                    intersect:true,
                    //custom: customTooltip
   
                  }
              }}
                
                />
              </div>
            </div>
        );
      }
    };