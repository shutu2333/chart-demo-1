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