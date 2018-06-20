import React from 'react';

import {
    VictoryTooltip,
    Flyout,
    VictoryLabel,

} from 'victory'

// export default class Label{
//     static defaultEvents = [{
//         target: 'data',
//         eventHandlers: {
    
//           onMouseOver: () => ({
//             target: 'labels',
//             mutation: () => ({ active: true }),
//           }),
    
//           onMouseOut: () => ({
//             target: 'labels',
//             mutation: () => ({ active: false }),
//           }),
    
//           onTouchStart: () => ({
//             eventKey: 'all',
//             target: 'labels',
//             mutation: () => ({ active: false }),
//           }),
    
//           onTouchEnd: () => ({
//             target: 'labels',
//             mutation: (p: *) => {
//               if (!p.data) {
//                 return { active: !p.active }
//               }
    
//               if (p.data.activeIndex === p.index) {
//                 p.data.activeIndex = -1
//                 return ({ active: false })
//               }
    
//               p.data.activeIndex = p.index
//               return ({ active: true })
//             },
//           }),
//         },
//       }]
    
//       static defaultProps = {
//         pointerLength: 10,
//       }
//     render(){

//     }
// }

type LabelProps = {
  datum: Object,
  x: string, //change
  y: number,
  datum: {
    header: string,
    subhead: string,
    value: string,
  },

  dx: number,
  dy: number,

  fontSize?: number,
}

function CustomLabelComponent(props: LabelProps) {
  const datum = props.datum;
  //console.log(datum)
  const subheadDy = datum.header ? '1.2em' : 0
  const text1=`${datum.label}` //label
  const text2 = 
  `${datum.label}\n ${datum.subhead}\n FTE: ${datum.y} ([num] %)`;

  let valueDy = 0

  if (datum.header || datum.subhead) {
    valueDy = (datum.header && datum.subhead)
      ? '2.4em'
      : '1.2em'
  }
  return (
    <g 
    style={ { pointerEvents: 'none' } }
    fill='red'
    width={ 60 }
    height={ 30 }
    // transform={ `translate(${ props.x - props.dx }, ${ props.y - props.dy } )` }
    // fontSize={ props.fontSize }
    // style={ { pointerEvents: 'none' } } 
          
    >
     {/* { datum.label
          ? (
            <text
              fill='#faa61a'
              dy={ valueDy }
            >
              { datum.label }
            </text>
          )
          : null
      }
      { datum.subhead
          ? (
            <text
              fill='white'
              dy={ subheadDy }
            >
              { datum.subhead }
            </text>
          )
          : null
      }
      { datum.y
          ? (
            <text
              fill='white'
              dy={ valueDy }
            >
              {`FTE: ${datum.y} ([num] %)` }
            </text>
          )
          : null
      } */}
      {/* <VictoryLabel 
      {...props}
      textAnchor="middle"
      verticalAnchor="middle"
      text={text1}
      angle={0}
      dy={-30}
      // dx={-10}
      style={{
        fontSize: 15,
        fill: '#A26500',
      }}
      renderInPortal={true}
      /> */}
      <VictoryLabel
      labelPlacement={"vertical"}
        {...props}
        textAnchor="middle"
        verticalAnchor="middle"
        text={`${text2}`}
        angle={0}
        dy={10}
        dx={0}
        style={{
          fontSize: 7,
          fill: '#faa61a',
        }}
        renderInPortal={true}
      />
    </g>
  );
}
export default class LabelComp extends React.Component {
    static defaultEvents = VictoryTooltip.defaultEvents
    static defaultEvents = [{
        target: "data",
        eventHandlers: {
          onMouseOver: (e) => {
            //console.log(e)
            return {
              target: "labels",
              mutation: () => ({ active: true })
            };
          },
          onMouseOut: () => {
            return {
              target: "labels",
              mutation: () => ({ active: false })
            };
          }
        }
      }];
    static defaultProps = {
              count: 0,
    }
    render() {
      const {x, y} = this.props;
      const rotation = `rotate(45 ${x}${y})`
      // if(this.props.count!==11){
      //   this.props.count=2;
      // }else{
      //   this.props.count=0;
      // }
      
      //console.log(this.props);
      return (
        <g
        // transform={rotation}
       
        >

       
          <VictoryTooltip 
          {...this.props} 
          renderInPortal={true}
          
          cornerRadius={ 0 }
           flyoutStyle={ {
            //stroke: '#faa61a',
            strokeWidth: 0,
            //width: 20,
            // eslint-disable-next-line css-modules/no-undef-class
            fill: '#282f37',
            //fontColor: '#000'
          } }

          
          // text={
          //   (datum) => `label: ${datum.label}
          //               x: ${datum.x}
          //               y: ${datum.y}`
          //             }
            
            //, text="Apples\n(green)", text={["first line", "second line"]}
          // labelComponent={
          //   <vic x={x} y={y}/>
          // }
          // labels={(x) => `y: ${y}`}
          labelComponent={<CustomLabelComponent />}
          flyoutComponent={
            <Flyout pointerLength={ 0 } width={80} height={50}  />
          }
          />
        </g>
      );
    }
  }