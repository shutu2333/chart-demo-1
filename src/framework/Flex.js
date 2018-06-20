import React from 'react';
import Flexbox from 'flexbox-react';
import ReactDOM from 'react-dom';
// import {Button} from 'bootstrap';
 
// ...


export default class Flex extends React.Component{
    constructor(){
        super();
        this.state={
            shouldScroll: false
        }
    }
    handleClick(e){
        
        //console.log(ReactDOM.findDOMNode(this).scrollTop);
        //ReactDOM.findDOMNode(this.myRef).scrollTop = 0;
        this.setState({
            shouldScroll: true
        });
    }

    componentDidUpdate() {
        if(this.state.shouldScroll){
            console.log(ReactDOM.findDOMNode(this.myRef))
            const element = ReactDOM.findDOMNode(this.myRef);
            //ReactDom.findDOMNode(this.refs.myRef).scrollIntoView();
            window.scrollTo(0, 0);
        }
        
      }

    addMyRef(ref){
        this.myRef = ref;
    }
    render(){
        return (
            <Flexbox flexDirection="row" maxHeight="600px">

            {/* <Flexbox element="header" height="60px">
                Header
            </Flexbox> */}
            
            <Flexbox flexGrow={3} order={1} >
                Content
            </Flexbox>
            {/* <div style={{overflow: 'scroll'}} ref={this.addMyRef.bind(this)}> */}
            <Flexbox ref={this.addMyRef.bind(this)} flexDirection="column" flexGrow={1} order={2} style={{border: 'solid 5px #faa61a',  overflow: 'auto', color: '#faa61a'}} maxWidth="350px" minHeight="900px">
                Filters
                <Flexbox>
                <table>
                    <tr>
                        <td>setting1</td>
                        <td>setting1</td>
                        <td>setting1</td>
                        <td>setting1</td>
                        <td>setting1</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>3</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>3</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>3</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>3</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                </table>

        
            


                </Flexbox>

                <p>

                    Lorem ipsum dolor sit amet, mazim aliquid mei no, quis repudiandae in mel. Delenit perpetua id mel. Doctus veritus sed id. Et assum philosophia concludaturque est. No per simul apeirian erroribus, et nec quodsi vituperata, ut pri habemus laboramus theophrastus.

                    Vim qualisque interesset in, duo ea ferri vitae. Efficiendi signiferumque eu sit. Fabulas molestie eu eum. Labitur praesent eu sed, ipsum vitae ne sit. Vix sale brute ex, te usu commodo aliquid iracundia. Et his illud dictas, ne eum clita virtute oporteat, in mei erat facilisis. Ad nisl utroque adipiscing quo.

                    Cu quo saepe convenire, ut partem alterum eos. Eam mazim everti argumentum et, ad duo sint case, vis suas integre numquam cu. Delicata instructior mea ei. Semper habemus ut has. Alia aliquip ea per. Cu modus facilis vix, ne vim soleat iudicabit, mea at zril partiendo referrentur.

                    Eu sint albucius evertitur sed, ignota epicuri assueverit at ius, per in novum instructior. Qui ad enim assum deseruisse, eam tritani molestiae et, odio errem accumsan sed an. Agam minimum eloquentiam per ne, ei nam feugait copiosae, ea nonumes mediocritatem his. Vis ad mucius splendide philosophia.

                    Ex labore electram sadipscing nec, ei fabulas accusam vulputate qui. Ius id velit suscipit intellegam, ferri voluptua deseruisse et sea, usu ea nonumy fastidii. Mnesarchum concludaturque has ad, ludus aliquam iudicabit pro in. Ea eum falli omittantur, usu graece perfecto referrentur id. Cu quo fugit timeam. Mutat prompta adversarium sit eu, no illud mazim efficiantur qui.
                </p>

             <button type="button" class="btn btn-outline-warning" onClick={this.handleClick.bind(this)}>Done</button>
            </Flexbox>
            {/* </div> */}
            
            {/* <Flexbox element="footer" height="60px">
                filters
            </Flexbox> */}
            </Flexbox>
        );
    }
}