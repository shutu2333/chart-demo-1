// example data sets
// (please notice the value="0" data items)
import React, { Component } from 'react'
// import { scaleLinear as linear } from 'd3-scale'
// import { voronoi } from 'd3-voronoi'
import {LabelComp} from '../framework'

import './styles.css';
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
 
];

const data_unimpacted = [
    {x: "a", y: 12, label: "0-24 Male", subhead: 'Not Impacted', header:'Males'}, 
    {x: "b", y: 13, label: "25-34 Male", subhead: 'Not Impacted',header:'Males'}, 
    {x: "c", y: 15, label: "35-44 Male", subhead: 'Not Impacted',header:'Males'},
    {x: "d", y: 11, label: "45-54 Male", subhead: 'Not Impacted',header:'Males'},
    {x: "e", y: 16, label: "55-64 Male", subhead: 'Not Impacted',header:'Males'},
    {x: "f", y: 14, label: "65+ Male", subhead: 'Not Impacted',header:'Males'},
    
    {x: "g", y: 12, label: "65+ Female", subhead: 'Not Impacted',header:'Females'}, 
    {x: "h", y: 13, label: "55-64 Female", subhead: 'Not Impacted',header:'Females'}, 
    {x: "i", y: 15, label: "45-54 Female", subhead: 'Not Impacted',header:'Females'},
    {x: "j", y: 10, label: "35-44 Female", subhead: 'Not Impacted',header:'Females'},
    {x: "k", y: 6, label: "25-34 Female", subhead: 'Not Impacted',header:'Females'},
    {x: "l", y: 14, label: "0-24 Female", subhead: 'Not Impacted',header:'Females'}
];

const data_impacted = [
    {x: "a", y: 2, label: "0-24 Male", subhead: 'Impacted', header:'Males' }, 
    {x: "b", y: 4, label: "25-34 Male", subhead: 'Impacted', header:'Males'}, 
    {x: "c", y: 6, label: "35-44 Male", subhead: 'Impacted', header:'Males'},
    {x: "d", y: 2, label: "45-54 Male", subhead: 'Impacted', header:'Males'},
    {x: "e", y: 1, label: "55-64 Male", subhead: 'Impacted', header:'Males'},
    {x: "f", y: 5, label: "65+ Male", subhead: 'Impacted', header:'Males'},
    
    {x: "g", y: 3, label: "65+ Female", subhead: 'Impacted', header:'Females'}, 
    {x: "h", y: 2, label: "55-64 Female", subhead: 'Impacted', header:'Females'}, 
    {x: "i", y: 6, label: "45-54 Female", subhead: 'Impacted', header:'Females'},
    {x: "j", y: 7, label: "35-44 Female", subhead: 'Impacted', header:'Females'},
    {x: "k", y: 3, label: "25-44 Female", subhead: 'Impacted', header:'Females'},
    {x: "l", y: 2, label: "0-24 Female", subhead: 'Impacted', header:'Females'}
  

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




  export default class NewChart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          chartData: {
              impacted: [],
              umimpacted: []
          },
          isDataOne: true,
          isDataTwo: true,
          isLoading: true
        };
        this.handleClickImpacted = this.handleClickImpacted.bind(this);
        this.handleClickUnimpacted = this.handleClickUnimpacted.bind(this);
      }
  

    componentDidMount(){

        this.setState({
            // chartData: 
            // {
            //     impacted:data_impacted,
            //     umimpacted:data_unimpacted
            // },
            isDataOne: true,
            isDataTwo: true,
            isLoading: false
   
        });
    }

    handleClick(){
        
    this.setState({
        isLoading:true,
        
    });
        if(this.state.isDataOne){
            this.setState({
                chartData: 
                {
                    impacted:[],
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

    handleClickImpacted(){
        this.setState({

            isDataOne: !this.state.isDataOne,
            isLoading: false
   
        });
        
    }
    handleClickUnimpacted(){
        this.setState({

            isDataTwo: !this.state.isDataTwo,
            isLoading: false
   
        });
    }
      render(){

        return (
            this.state.isLoading? <h1>Loading</h1> : 
            <div style={{width: '70%', height: '100vh', margin: '0 auto'}}>
           
            <div style={{color: "#fff"}}>
            <div>
                Human Capital Impact
            </div>
            {/* <div>How will emerging technologies impact your workforce?  See how employees are impacted as well as how that impact differs by gender.</div> */}
           </div>
           <button onClick = {this.handleClickImpacted}>Impacted hidden</button>
            <button onClick = {this.handleClickUnimpacted}>Not Impacted hidden</button>
            <VictoryChart 
           
           
           
            //theme={VictoryTheme.material}
           
            polar
            startAngle={-90}
            endAngle={270}
            //padding={ { left: 40, bottom: 0, top: 20, right: 100 } }
            innerRadius={ 20 }
            containerComponent={ 
                <VictoryContainer
                    events={ {
                        ref: svg => { if (!this.svgs) { console.log(svg); this.svgs= svg } },
                    } }
                    
                    // labels={["A","B","C"]}
                    // events={{onClick: this.handleClick,
                   
                    //         //ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                    //         }} 
                    //styles={{width: '300px'}}
                />}

                
            >
            
          
      
                <VictoryStack              
                    //colorScale={["orange", "gold", "bule"]}
                    
                    >           
                    {this.state.isDataOne &&  <VictoryBar
                           
                          animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 }
                              }}
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
                                          return "#c4c7cf"; //light grey

                                          case 'l': //return "#faa61a";
                                          case 'k': //return "#8e9bad";
                                          case 'j': //return "#ff7473";
                                          case 'i': //return "#2BBBD8";
                                          case 'g': //return "#87E293";
                                          case 'h': //return "#f69e53";
                                          return "#f9bd66" //light yellow
                                          
                                      }
                                  }
                                  // d.x === 'a' ? "#faa61a" : "#8e9bad",
                               }
                            }}
                          data={data_unimpacted}
                          labelComponent={<LabelComp horizontal labelPlacement={"vertical"}/>}
                          
                          
                      /> }      
                       

                       {this.state.isDataTwo && <VictoryBar
                             //animate={{duration: 500, easing: "bounce"}}
                             animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 }
                              }}
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
                                            return "#8e9bad" //dark grey

                                            case 'l': //return "#f9bd66";
                                            case 'k': //return "#989EAE";
                                            case 'j': //return "#d18786";
                                            case 'i': //return "#60d6e8";
                                            case 'g': //return "#b3ebc0";
                                            case 'h': //return "#edad71";
                                            return "#faa61a" //light grey
                                           
                                            
                                        }
                                    }
                                    // d.x === 'a' ? "#faa61a" : "#8e9bad",
                                 }
                              }}
                            
                            data={data_impacted}
                        //labels={<LabelComp horizontal labelPlacement={"vertical"} />}
                        labelComponent={<LabelComp horizontal labelPlacement={"vertical"}/>}
                        
                        />
                      }
                        
                        </VictoryStack>

                    
                        {/* vertical axis */}
                        <VictoryPolarAxis
                            //theme={VictoryTheme.material}            
                            style={{
                                axis: {stroke: "#fff", strokeWidth:1.5},
                                axisLabel: {fill: "#fff", fontSize: 10, padding: 30},
                                grid: {stroke: 'rgba(255,255,255,0.4)', strokeWidth:0.5},
                                ticks: {stroke: "#FFE2B7", size: 1},
                                tickLabels: {fontSize: 6, padding: 10,fill: "#fff", fontFamily: "'Fira Sans', sans-serif", fontWeight: 100}
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
                            tickValues={ [
                                2,
                               
                                6,
                             
                                10,
                             
                                14,
                             
                                18,
                                22
                                

                            ] }

                            tickFormat={ x => `${x} k` }
                            axisAngle={ 90 }
                            // axisAngle={ -90 }
                            //   axisComponent={ <Empty /> }
                            tickLabelComponent={
                                <VictoryLabel
                                angle={ 0 }
                                dx={ 3 }
                                dy={ 5 }
                                textAnchor='start'
                                
                                />
                            }
                            />

                        {
                            ["0-24", "25-34", "35-44", "45-54", "55-64", "65+", "65+", "55-64", "45-54", "35-44", "25-34", "0-24"].map((d, i) => {
                            return (
                                <VictoryPolarAxis dependentAxis
                                style={{
                                    axis: {stroke: "rgba(255,255,255,0.9)", strokeWidth:0},
                                    axisLabel: {fill: "#FFE2B7", fontSize: 6, padding: 10, fontFamily: "'Fira Sans', sans-serif", fontWeight: 100},
                                    //grid: {stroke: 'rgba(255,255,255,0.8)', strokeWidth:0.5},
                                    //ticks: {stroke: "#FFE2B7", size: 0},
                                    tickLabels: {fontSize: 5, padding: 5, fill: "none"},

                                    
                                }}
                                key={i}
                                innerRadius={30}
                                label={d}
                                labelPlacement="perpendicular"
                                //perpendicular || parallel
                                // style={{ tickLabels: { fill: "none" } }}
                                axisValue={i+1}
                                // axisAngle={ -90 }
                                />
                            );
                            })
                        }

                        {/* verical down */} 
                         {/* <VictoryPolarAxis
                            //theme={VictoryTheme.material}      
     
                            style={{
                                //rgba(98,104,125,0.8)
                                axis: {stroke: "#fff", strokeWidth:1.5},
                                axisLabel: {fill: "white", fontSize: 10, padding: 30},
                                grid: {stroke: 'rgba(255,255,255,0.3)', strokeWidth:0.5},
                                ticks: {stroke: "#FFE2B7", size: 1},
                                tickLabels: {fontSize: 8, padding: 10,fill: "white"},
                                parent: { fill: 'red', pointerEvents: 'none' },
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
                        /> */}
                        
                        {/* left and right */}
                        <VictoryPolarAxis

                            style={{
                                axis: {stroke: "rgba(255,255,255,0.9)", strokeWidth:1.0},
                                axisLabel: {fill: "#FFE2B7", fontSize: 10, padding: 10},
                                //grid: {stroke: 'rgba(255,255,255,0.8)', strokeWidth:0.5},
                                //ticks: {stroke: "#FFE2B7", size: 0},
                                tickLabels: {fontSize: 7, padding: 5,fill: "white", fontFamily: "'Fira Sans', sans-serif", fontWeight: 100}
                            }}
                            

                                groupComponent={
                                <g pointerEvents='none' role='presentation' />
                                }
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
                                if(x===3.5 ){
                                    return `Males \n Total: 1257\n Impacted ${Math.floor(1257*0.28)} (28.57%)`;
                                }
                                if(x===9.5 ){
                                    return `Females \n Total: 1673\n Impacted ${Math.floor(1673*0.29)} (29.16%)`;
                                }
                                // return `${x}`;
                                }
                            }
                                    


                    />


       
            </VictoryChart>

          
    
        </div>);
      }
    }