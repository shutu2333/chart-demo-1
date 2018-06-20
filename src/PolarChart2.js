// example data sets
// (please notice the value="0" data items)
import React, { Component } from 'react'
// import { scaleLinear as linear } from 'd3-scale'
// import { voronoi } from 'd3-voronoi'
import {LabelComp} from './framework'
import {
  VictoryChart,
  VictoryStack,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryContainer,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryArea,
  Flyout,
  VictoryTooltip
  
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
    {id: 1, value: 20},
    {id: 2, value: 33},
    {id: 3, value: 44},
    {id: 4, value: 50},
    {id: 5, value: 60},
    {id: 6, value: 71},
    {id: 7, value: 82},
    {id: 8, value: 100}];
  
const data2 = [
    {id: 1, value: 15},
    {id: 2, value: 11},
    {id: 3, value:  5},
    {id: 4, value: 19},
    {id: 5, value: 18},
    {id: 6, value:  3},
    {id: 7, value: 11},
    {id: 8, value:  0}];


const data3 = [
    {id: 1, value: 20},
    {id: 2, value:  12},
    {id: 3, value:  9},
    {id: 4, value: 42},
    {id: 5, value: 30},
    {id: 6, value:  22},
    {id: 7, value: 17},
    {id: 8, value: 13}];
    
const data4 = [
    {id: 1, value: 26},
    {id: 2, value: 21},
    {id: 3, value:  45},
    {id: 4, value: 19},
    {id: 5, value: 20},
    {id: 6, value:  7},
    {id: 7, value: 3},
    {id: 8, value:  10}];

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
            <div style={{height: '100vh'}}>
        <div style={{width:'500px', height:'500px', margin: '0 auto'}}>
            <button onClick = {this.handleClick}>Update</button>
            
            <VictoryChart
          domain={{ x: [2, 11], y: [0, 200] }}
          containerComponent={
            <VictoryVoronoiContainer />
        }
        >

        <VictoryAxis
              axisLabelComponent={ <VictoryLabel dy={ -65 } /> }
              label='Salary Cost'
              dependentAxis
              tickFormat={ x => x}
              style={{
                axis: {stroke: "#fff"},
                axisLabel: {fill: "white", fontSize: 20, padding: 30},
                //grid: {stroke: (t) => t > 0.5 ? "red" : "grey"},
                //ticks: {stroke: "#FFE2B7", size: 5},
                tickLabels: {fontSize: 15, padding: 5,fill: "white"}
              }}
            />
        <VictoryAxis
            axisLabelComponent={ <VictoryLabel dy={ 35 } /> }
            label='Year'
            tickValues={ [2, 4, 6, 8,10] }
            tickFormat={ y => y }
            style={{
                axis: {stroke: "#fff"},
                axisLabel: {fill: "white",fontSize: 20, padding: 30},
                //grid: {stroke: (t) => t > 0.5 ? "red" : "grey"},
                //ticks: {stroke: "#FFE2B7", size: 5},
                tickLabels: {fontSize: 15, padding: 5,fill: "white"}
              }}
        />

        <VictoryStack>
          <VictoryArea
            labelComponent={<LabelComp/>}

            
           
            data={[
              {x: 2, y: 10, label: "A"},
              {x: 4, y: 20, label: "B"},
              {x: 6, y: 33, label: "C"},
              {x: 8, y: 50, label: "D"},
              {x: 10, y: 57, label: "E"}
            ]}
            style={{
              data: {fill: "#faa61a", width: 20}
            }}
          />

           <VictoryArea
            labelComponent={<LabelComp/>}

            
           
            data={[
              {x: 2, y: 15, label: "A"},
              {x: 4, y: 10, label: "B"},
              {x: 6, y: 23, label: "C"},
              {x: 8, y: 47, label: "D"},
              {x: 10, y: 67, label: "E"}
            ]}
            style={{
              data: {fill: "#A26500", width: 20}
            }}
          />

          </VictoryStack>
        </VictoryChart>



            <VictoryChart
         
            animate={{duration: 500, easing: "bounce"}}
            // theme={VictoryTheme.material}
            // polar
            //padding={ { left: 40, bottom: 0, top: 20, right: 100 } }
            // innerRadius={ 50 }
    //         containerComponent={ <VictoryContainer
    //             labels={(d) => `${round(d.x, 2)}, ${round(d.y, 2)}`}
    //             events={{onClick: this.handleClick}} 
              
    // />
    // }
            >

               <VictoryStack>
                   <VictoryArea 
                   style={{
                    data: { fill: "#faa61a" }
                  }}
                  data={this.state.chartData.male} 
                  
                //   containerComponent={
                //     <VictoryVoronoiContainer />
                //   }
                  //labelComponent={<VictoryLabel renderInPortal dy={-10}/>}
                  labelComponent={<LabelComp dy={-10}/>}
                  
                  />

                  {/* <VictoryArea 
                   style={{
                    data: { fill: "cornflowerblue" }
                  }}
                  data={this.state.chartData.female} 
                  /> */}


                   
               </VictoryStack>

 {/* <VictoryPolarAxis
              style={ {
                parent: { fill: 'red', pointerEvents: 'none' },
              } }
              groupComponent={
                <g pointerEvents='none' role='presentation' />
              }
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
                 groupComponent={
                    <g pointerEvents='none' role='presentation' />
                  }
                  labelPlacement='parallel'
    
                  // The following is a hack to force rerendering of the tick labeles
                  // VictoryChart expects this function to be pure.
                //   tickValues={ [
                //     '2',
                //     '4',
                //     '6',
                //     '8',
                //   ] }

                  tickFormat={ x => x+'k'}
                  


  /> */}


            
            </VictoryChart>
            
        </div>
        </div>);
      }
    }