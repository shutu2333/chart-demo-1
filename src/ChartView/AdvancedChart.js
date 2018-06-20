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
  VictoryPie,
  VictoryVoronoiContainer,
  VictoryGroup,
  VictoryTooltip,
  Line
  
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
    {
        x: 'M',
        y: 944,
        y0: 0,
        age:'0-24',
        label: '',
        header: 'Males',
        subhead: 'Not Impacted',
        //value: `FTE 944  ( 75.17% )`,
        value: `FTE 23  ( 65.31% )`
    },
    {

        x: 'F',
        y: 1190,
        y0: 0,
        age:'0-24',
        label: '',
        header: 'Females',
        subhead: 'Not Impacted',
        value: `FTE 38  ( 64.54% )`
        //value: `FTE 1.19 K ( 70.84% )`,
    },

];
  
const data2 = [
    {
        x: 'M',
        y: 312,
        y0: 0,
        age:'0-24',
        label: '',
        header: 'Males',
        subhead: 'Impacted',
        //value: `FTE 312  ( 24.83% )`,
        value: `FTE 12  ( 34.69% )`
    },
    {

        x: 'F',
        y: 487,
        y0: 0,
        age:'0-24',
        label: '',
        header: 'Females',
        subhead: 'Impacted',
        value: `FTE 19  ( 33.46% )`
        //value: `FTE 487  ( 29.16% )`,
    },
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
        map(value => ({
            x:value.x, 
            y:value.y
        })),
)(data1);
const dataPro2 =flow(
        //map(v=>v.name),
        // sortBy(v=>v.level),
        // sortedUniq,
        // compact,
        map(value => ({
            x:value.x, 
            y:value.y
        })),
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

  export default class AdvancedChart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          chartData: {
              impacted: [],
              umimpacted: []
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
                impacted:dataPro1,
                umimpacted:dataPro2
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
                    impacted:dataPro2,
                    umimpacted:dataPro1
                },
                isDataOne: false,
                isLoading: false
            });
        }else{
            this.setState({
                chartData: 
                {
                    impacted:dataPro1,
                    umimpacted:dataPro2
                },
                isDataOne: true,
                isLoading: false
            });
        }
        

    }
      render(){

        return (
            this.state.isLoading? <h1>Loading</h1> : 
        <div style={{width: '800px', height: '100vh', margin: '0 auto'}}>
            <button onClick = {this.handleClick}>Update</button>
            

            {/* <VictoryGroup> */}
            <VictoryChart
         
            //animate={{duration: 500, easing: "bounce"}}
            //theme={VictoryTheme.material}
            polar
            startAngle={-90}
            endAngle={270}
            //padding={ { left: 40, bottom: 0, top: 20, right: 100 } }
            innerRadius={ 20 }
            containerComponent={ 
                <VictoryVoronoiContainer
                    
                    //labels={<LabelComp />}
                    // events={{onClick: this.handleClick,
                   
                    //         //ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                    //         }} 
                    //styles={{width: '300px'}}
                />}

                
            >
            
          
            {/* <VictoryGroup> */}
                <VictoryStack
                
                    //colorScale={["orange", "gold", "bule"]}
                    >

                     {/* <VictoryPie
                        //colorScale={["tomato", "orange", "gold" ]}
                        startAngle={0}
                        endAngle={180}
                        data={[
                            { x: 1, y: 2, label: "one" },
                            { x: 2, y: 3, label: "two" },
                            { x: 3, y: 5, label: "three" }
                        ]}
                    />

                    <VictoryPie
                     //colorScale={["gold", "cyan", "navy" ]}
                        startAngle={180}
                        endAngle={360}
                        data={[
                            { x: 4, y: 3, label: "four" },
                            { x: 5, y: 4, label: "five" },
                            { x: 6, y: 8, label: "six" }
                        ]}
                    /> */}
                  
                        <VictoryBar
                           
                             style={{
                                data: { 
                                    
                                    fill: (d) => {
                                        switch(d.x){
                                            case 'a': //return "#faa61a";
                                            case 'b': //return "#8e9bad";
                                            case 'c': //return "#ff7473";
                                            case 'd': //return "#2BBBD8";
                                            case 'f': //return "#87E293";
                                            case 'e': //return "#f69e53";
                                            return "#c4c7cf";

                                            case 'l': //return "#faa61a";
                                            case 'k': //return "#8e9bad";
                                            case 'j': //return "#ff7473";
                                            case 'i': //return "#2BBBD8";
                                            case 'g': //return "#87E293";
                                            case 'h': //return "#f69e53";
                                            return "#faa61a"
                                            
                                        }
                                    }
                                    // d.x === 'a' ? "#faa61a" : "#8e9bad",
                                 }
                              }}
                            data={[
                                {x: "a", y: 12, label: "0-24 Male"}, 
                                {x: "b", y: 13, label: "25-34 Male"}, 
                                {x: "c", y: 15, label: "35-44 Male" },
                                {x: "d", y: 11, label: "45-54 Male"},
                                {x: "e", y: 16, label: "55-64 Male"},
                                {x: "f", y: 14, label: "65+ Male"},
                                
                                {x: "g", y: 12, label: "65+ Female"}, 
                                {x: "h", y: 13, label: "55-64 Female"}, 
                                {x: "i", y: 15, label: "45-54 Female"},
                                {x: "j", y: 10, label: "35-44 Female"},
                                {x: "k", y: 6, label: "25-34 Female"},
                                {x: "l", y: 14, label: "0-24 Female"}
                            ]}
                            labelComponent={<LabelComp />}
                        />
                        <VictoryBar
                            style={{
                                data: { 
                                    
                                    fill: (d) => {
                                        switch(d.x){
                                            case 'a': //return "#f9bd66";
                                            case 'b': //return "#989EAE";
                                            case 'c': //return "#d18786";
                                            case 'd': //return "#60d6e8";
                                            case 'f': //return "#b3ebc0";
                                            case 'e': //return "#edad71";
                                            return "#8e9bad"

                                            case 'l': //return "#f9bd66";
                                            case 'k': //return "#989EAE";
                                            case 'j': //return "#d18786";
                                            case 'i': //return "#60d6e8";
                                            case 'g': //return "#b3ebc0";
                                            case 'h': //return "#edad71";
                                            return "#f9bd66"
                                           
                                            
                                        }
                                    }
                                    // d.x === 'a' ? "#faa61a" : "#8e9bad",
                                 }
                              }}
                            
                            data={[
                                {x: "a", y: 2, label: "0-24 Male"}, 
                                {x: "b", y: 4, label: "25-34 Male"}, 
                                {x: "c", y: 6, label: "35-44 Male" },
                                {x: "d", y: 2, label: "45-54 Male"},
                                {x: "e", y: 1, label: "55-64 Male"},
                                {x: "f", y: 5, label: "65+ Male"},
                                
                                {x: "g", y: 3, label: "65+ Female"}, 
                                {x: "h", y: 2, label: "55-64 Female"}, 
                                {x: "i", y: 6, label: "45-54 Female"},
                                {x: "j", y: 7, label: "35-44 Female"},
                                {x: "k", y: 3, label: "25-44 Female"},
                                {x: "l", y: 2, label: "0-24 Female"}
                              
                            
                        ]}

                        labelComponent={<LabelComp />}
                        
                        />
                        {/* <VictoryBar
                            data={[{x: "a", y: 3}, {x: "b", y: 2}, {x: "c", y: 6}]}
                        /> */}
                        </VictoryStack>

                    
    
                            
                

            {/* </VictoryGroup> */}

           

                  {/* <VictoryStack>

                  <VictoryBar 
                  labelComponent={<LabelComp/>}
                   style={{
                    data: {
                        //impacted: Female:male
                        fill: (d) => d.x === 'F' ? "#f9bd66" : "#c4c7cf"
                    }
                  }}
                  data={this.state.chartData.impacted} 
                  />

                  <VictoryBar 
                   
                   labelComponent={<LabelComp/>}
                  style={{
                   data: { 
                       
                       fill: (d) => d.x === 'F' ? "#faa61a" : "#8e9bad",
                    }
                 }}
                 data={this.state.chartData.umimpacted} 
                 />

                   </VictoryStack> */}

                  
            
                  

                  {/* <VictoryPie
                    data={[
                        { x: 1, y: 2, label: "one" },
                        { x: 2, y: 3, label: "two" },
                        { x: 3, y: 5, label: "three" }
                    ]}
                    /> */}
                   


              

                        <VictoryPolarAxis
                                    theme={VictoryTheme.material}            
                                    style={{
                                        axis: {stroke: "#fff", strokeWidth:3},
                                        axisLabel: {fill: "#fff", fontSize: 10, padding: 30},
                                        grid: {stroke: 'rgba(98,104,125,0.2)'},
                                        ticks: {stroke: "#FFE2B7", size: 1},
                                        tickLabels: {fontSize: 8, padding: 10,fill: "#fff"}
                                    }}

                            
                                    // innerRadius={20}
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
                                    theme={VictoryTheme.material}            
                                    style={{
                                        //rgba(98,104,125,0.8)
                                        axis: {stroke: "#fff", strokeWidth:3},
                                        axisLabel: {fill: "white", fontSize: 10, padding: 30},
                                        grid: {stroke: 'rgba(98,104,125,0.2)'},
                                        ticks: {stroke: "#FFE2B7", size: 1},
                                        tickLabels: {fontSize: 8, padding: 10,fill: "white"}
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
                                    axisAngle={ -90 }
                                    
                                    //   axisComponent={ <Empty /> }
                                    tickLabelComponent={
                                        <VictoryLabel
                                        angle={ 0 }
                                        dx={ -10 }
                                        dy={ 5 }
                                        textAnchor='end'
                                        />
                                    }
                                    />
                                    
                        <VictoryPolarAxis

                                        style={{
                                            axis: {stroke: "rgba(98,104,125,0.6)", strokeWidth:1.5},
                                            axisLabel: {fill: "#FFE2B7", fontSize: 10, padding: 10},
                                            //grid: { stroke: 'rgba(98,104,125,0.2)'},
                                            ticks: {stroke: "#FFE2B7", size: 0},
                                            tickLabels: {fontSize: 8, padding: 5,fill: "white"}
                                        }}
                            
                                         groupComponent={
                                            <g pointerEvents='none' role='presentation' />
                                          }

                                          //gridComponent={<Line type={"grid"} style={{stroke: 'rgba(98,104,125,0.2)'}} />}
                                          labelPlacement='vertical'
                            
                                        // The following is a hack to force rerendering of the tick labeles
                                        // VictoryChart expects this function to be pure.
                                          tickValues={ [
                                            0,
                                            0.5,
                                            1,
                                            1.5,
                                            2,
                                            2.5,
                                            3,
                                            3.5,
                                            4,
                                            4.5,
                                            5,
                                            5.5,
                                            6,
                                            6.5,
                                            7,
                                            7.5,
                                            8,
                                            8.5,
                                            9,
                                            9.5,
                                            10,
                                            10.5,
                                            11,
                                            11.5
                                            


                                          ] }

                                        tickFormat={ x => {
                                            if(x===3 ){
                                                return `Males \n Total: 1257`;
                                            }
                                            if(x===10 ){
                                                return `Females \n Total: 1673`;
                                            }
                                            // return `${x}`;
                                            }
                                        }
                                        


                        />


       
            </VictoryChart>

          
         {/* </VictoryGroup> */}
            
        </div>);
      }
    }