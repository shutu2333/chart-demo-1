// example data sets
// (please notice the value="0" data items)
import React, { Component } from 'react'
// import { scaleLinear as linear } from 'd3-scale'
// import { voronoi } from 'd3-voronoi'
import {LabelComp} from '../framework'

import {
  VictoryChart,
  VictoryStack,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryContainer,
  VictoryTheme,
  VictoryVoronoiContainer
  
} from 'victory'

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


// example data sets
// (please notice the value="0" data items)

const data1 = [
    {id: 1, value: 15},
    {id: 2, value:  2},
    // {id: 3, value:  0},
    // {id: 4, value: 12},
    // {id: 5, value: 20},
    // {id: 6, value:  0},
    // {id: 7, value: 11},
    // {id: 8, value: 10}
];
  
const data2 = [
    {id: 1, value: 15},
    {id: 2, value: 11},
    // {id: 3, value:  5},
    // {id: 4, value: 19},
    // {id: 5, value: 18},
    // {id: 6, value:  3},
    // {id: 7, value: 11},
    // {id: 8, value:  0}
];


const data3 = [
    {id: 1, value: 20},
    {id: 2, value:  12},
    // {id: 3, value:  9},
    // {id: 4, value: 42},
    // {id: 5, value: 30},
    // {id: 6, value:  22},
    // {id: 7, value: 17},
    // {id: 8, value: 13}
];
    
const data4 = [
    {id: 1, value: 26},
    {id: 2, value: 21},
    // {id: 3, value:  45},
    // {id: 4, value: 19},
    // {id: 5, value: 20},
    // {id: 6, value:  7},
    // {id: 7, value: 3},
    // {id: 8, value:  10}
];

const dataPro1 =flow(
        //map(v=>v.name),
        // sortBy(v=>v.level),
        // sortedUniq,
        // compact,
        map(value => ({x:value.id, y:value.value})),
)(data1);
const dataPro2 =flow(
        //map(v=>v.name),
        // sortBy(v=>v.level),
        // sortedUniq,
        // compact,
        map(value => ({x:value.id, y:value.value})),
)(data2);


const dataPro3 =flow(
    //map(v=>v.name),
    // sortBy(v=>v.level),
    // sortedUniq,
    // compact,
    map(value => ({x:value.id, y:value.value})),
)(data3);
const dataPro4 =flow(
    //map(v=>v.name),
    // sortBy(v=>v.level),
    // sortedUniq,
    // compact,
    map(value => ({x:value.id, y:value.value})),
)(data2);

  export default class PolarChart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          chartData: {
              male: [],
              female: []
          },
          isDataOne: false,
          isLoading: true
        };
        this.handleClick = this.handleClick.bind(this);
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

        this.setState({
            chartData: 
            {
                male:dataPro1,
                female:dataPro2
            },
            isDataOne: true,
            isLoading: false
   
        });
    }

    handleClick(){
        
    this.setState({
        isLoading:true
    });
        if(this.state.isDataOne){
            this.setState({
                chartData: 
                {
                    male:dataPro3,
                    female:dataPro4
                },
                isDataOne: false,
                isLoading: false
            });
        }else{
            this.setState({
                chartData: 
                {
                    male:dataPro1,
                    female:dataPro2
                },
                isDataOne: true,
                isLoading: false
            });
        }
        

    }
      render(){

        return (
            this.state.isLoading? <h1>Loading</h1> : 
        <div style={{width: '500px', height: '100vh', margin: '0 auto'}}>
            <button onClick = {this.handleClick}>Update</button>
            
            <VictoryChart
         
            animate={{duration: 500, easing: "bounce"}}
            theme={VictoryTheme.material}
            polar
            //padding={ { left: 40, bottom: 0, top: 20, right: 100 } }
            innerRadius={ 20 }
            containerComponent={ 
                <VictoryVoronoiContainer
                    labels={(d) => `${round(d.x, 2)}, ${round(d.y, 2)}`}
                    events={{onClick: this.handleClick,
                            //ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                            }} 
                />}
            >
            
          
               <VictoryStack>
                   <VictoryBar 
                    labelComponent={<LabelComp/>}
                   style={{
                    data: { fill: "#faa61a" }
                  }}
                  data={this.state.chartData.male} 
                  />

                  <VictoryBar 
                   style={{
                    data: { fill: "#4695d6" }
                  }}
                  data={this.state.chartData.female} 
                  />


                   
               </VictoryStack>

 <VictoryPolarAxis
             theme={VictoryTheme.material}            
             style={{
                axis: {stroke: "rgba(98,104,125,0.6)", strokeWidth:1.5},
                axisLabel: {fill: "#FFE2B7", fontSize: 10, padding: 30},
                grid: {stroke: 'rgba(98,104,125,0.2)'},
                ticks: {stroke: "#FFE2B7", size: 1},
                tickLabels: {fontSize: 8, padding: 10,fill: "#FFE2B7"}
            }}

       
            innerRadius={10}
            //   style={ {
            //     parent: { fill: 'red', pointerEvents: 'none' },
            //   } }
            //   groupComponent={
            //     <g pointerEvents='none' role='presentation' />
            //   }
              dependentAxis
            //   tickValues={ niceTicks }
              tickFormat={ x => `${x} %` }
              axisAngle={ 90 }
            //   axisComponent={ <Empty /> }
              tickLabelComponent={
                <VictoryLabel
                  angle={ 0 }
                  dx={ 10 }
                  dy={ 0 }
                  textAnchor='start'
                />
              }
            />
               
  <VictoryPolarAxis

                style={{
                    axis: {stroke: "rgba(98,104,125,0.6)", strokeWidth:1.5},
                    axisLabel: {fill: "#FFE2B7", fontSize: 10, padding: 30},
                    grid: {stroke: 'rgba(98,104,125,0.2)'},
                    ticks: {stroke: "#FFE2B7", size: 0},
                    tickLabels: {fontSize: 8, padding: 10,fill: "#FFE2B7"}
                }}
    
                //  groupComponent={
                //     <g pointerEvents='none' role='presentation' />
                //   }
                //   labelPlacement='parallel'
    
                  // The following is a hack to force rerendering of the tick labeles
                  // VictoryChart expects this function to be pure.
                //   tickValues={ [
                //     '2',
                //     '4',
                //     '6',
                //     '8',
                //   ] }

                  tickFormat={ x => x+'k'}
                  


  />


       
            </VictoryChart>
            


                <VictoryChart
         
         //animate={{duration: 500, easing: "bounce"}}
         theme={VictoryTheme.material}
         polar
         startAngle={90}
         endAngle={-90}
         //padding={ { left: 40, bottom: 0, top: 20, right: 100 } }
         innerRadius={ 20 }
         containerComponent={ 
             <VictoryVoronoiContainer
                 
                 labels={(d) => `${d.x} ${d.y}`}
                 events={{onClick: this.handleClick,
                
                         //ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                         }} 
               
             />}
         
             
         >
         
         
         {/* <VictoryGroup> */}
             <VictoryStack
                 //colorScale={["orange", "gold", "bule"]}
                 >
         
                  
               
                     <VictoryBar
                          style={{
                             data: { 
                                 
                                 fill: (d) => {
                                     switch(d.x){
                                         case 'a': return "#faa61a";
                                         case 'b': return "#8e9bad";
                                         case 'c': return "#ff7473";
                                         case 'd': return "#2BBBD8";
                                         
                                     }
                                 }
                                 // d.x === 'a' ? "#faa61a" : "#8e9bad",
                              }
                           }}
                         data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5},{x: "d", y: 1},]}
                     />
                     <VictoryBar
                         style={{
                             data: { 
                                 
                                 fill: (d) => {
                                     switch(d.x){
                                         case 'a': return "#f9bd66";
                                         case 'b': return "#989EAE";
                                         case 'c': return "d18786";
                                         case 'd': return "#60d6e8";
                                         
                                     }
                                 }
                                 // d.x === 'a' ? "#faa61a" : "#8e9bad",
                              }
                           }}
                         
                         data={[{x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}, {x: "d", y: 3}]}
                     />
                    
                     </VictoryStack>
         
                 
         
                         
             
         
         
                     <VictoryPolarAxis
                                 theme={VictoryTheme.material}            
                                 style={{
                                     axis: {stroke: "rgba(98,104,125,0.6)", strokeWidth:1.5},
                                     axisLabel: {fill: "#FFE2B7", fontSize: 10, padding: 30},
                                     grid: {stroke: 'rgba(98,104,125,0.2)'},
                                     ticks: {stroke: "#FFE2B7", size: 1},
                                     tickLabels: {fontSize: 8, padding: 10,fill: "#FFE2B7"}
                                 }}
         
                         
                                 innerRadius={10}
                                 //   style={ {
                                 //     parent: { fill: 'red', pointerEvents: 'none' },
                                 //   } }
                                 //   groupComponent={
                                 //     <g pointerEvents='none' role='presentation' />
                                 //   }
                                 dependentAxis
                                 //   tickValues={ niceTicks }
                                 tickFormat={ x => `${x} K` }
                                 axisAngle={ 90 }
                                 //   axisComponent={ <Empty /> }
                                 tickLabelComponent={
                                     <VictoryLabel
                                     angle={ 0 }
                                     dx={ 10 }
                                     dy={ 0 }
                                     textAnchor='start'
                                     />
                                 }
                                 />
                                 
                     <VictoryPolarAxis
         
                                     style={{
                                         axis: {stroke: "rgba(98,104,125,0.6)", strokeWidth:1.5},
                                         axisLabel: {fill: "#FFE2B7", fontSize: 10, padding: 30},
                                         grid: {stroke: 'rgba(98,104,125,0.2)'},
                                         ticks: {stroke: "#FFE2B7", size: 0},
                                         tickLabels: {fontSize: 8, padding: 10,fill: "#FFE2B7"}
                                     }}
                         
                                      groupComponent={
                                         <g pointerEvents='none' role='presentation' />
                                       }
                                       labelPlacement='parallel'
                         
                                     // The following is a hack to force rerendering of the tick labeles
                                     // VictoryChart expects this function to be pure.
                                       tickValues={ [
                                         1,
                                         1.5,
                                         2,
                                         2.5,
         
         
                                       ] }
         
                                     tickFormat={ x => {
                                         if(x===1 ){
                                             return `Males \n Total: [number]`;
                                         }
                                         if(x===2 ){
                                             return `Females \n Total: [number]`;
                                         }
                                         }
                                     }
                                     
         
         
                     />
         
         
         
         </VictoryChart>





        </div>);
      }
    }