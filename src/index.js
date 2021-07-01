import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Content from './contents';

class TileContent extends React.Component {
    constructor(props){
        super(props);
        this.side = "front"
        this.content = new Content();
    }
    render(){
        return(<div>
            <span className="side">{this.side}</span>
            <span>{this.content.content}</span>
        </div>);
    }
}

class Tile extends React.Component {

    constructor(props){
        super(props);
    }

    shiftContent(value){
        switch(value){
            case 0:
                console.log('scroll up and to the left');
                break;
            case 1:
                console.log('scroll up');
                break;
            default:
                console.log('scroll down');
        }
    }
    
    handleClick(value){
        if(value === 4){
            console.log('middle', value);
        } else {
            this.shiftContent(value);
            console.log('side', value);
        }
        console.log('element: ', document.getElementById(value));
    }

    render(){
        return(<div id={this.props.value} className="tile">
            <div className="content">
                <button className="direction-selector" onClick={() => {
                    this.handleClick(this.props.value);
                }}>{this.props.value}</button>
            </div>
        </div>);
    }
}
class Grid extends React.Component {
    
    render () {
        return(
            <div className="grid">
                {this.renderTile(0)}
                {this.renderTile(1)}
                {this.renderTile(2)}
                {this.renderTile(3)}
                {this.renderTile(4)}
                {this.renderTile(5)}
                {this.renderTile(6)}
                {this.renderTile(7)}
                {this.renderTile(8)}
            </div>
        );
    }
    renderTile(i){
        return <Tile value={i}></Tile>
    }
}

class TestGame extends React.Component {


    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.unused = 54;
        this.state = {
            paused: false,
            delay: 500,
            stopSim: false,
            ants: {}
        };
        //this.handleInput = this.handleInput.bind(this);
    }

    handleKeyPress = (event) => {
        console.log('keypress called: ', event);
        if(event.key === 'd'){
            this.unused += 4;
        } else if(event.key === 'a'){
            this.unused -= 4;
        }
    }

    startSim(){
        //not working. Not sure how to stop the animation
        //stop current sim
        this.setState({stopSim: true});
        let ant1 = {
            x: 4,
            y: 4,
            size: 8,
            probs: [0.2, 0.3, 0.1, 0.4, 0.3], //move left, move right, move up, move down, breed
            color: 250,
            maxAge: 400,
            age: 0,
            stepSize: 11,
            color1: 50,
            color2 : 20,
            color3: 180,
            foodGain: 6
        }
        let ant2 = {
            x: 50,
            y: 50,
            size: 10,
            probs: [0.4, 0.2, 0.2, 0.2, 0.8],
            color: 20,
            maxAge: 80,
            age: 0,
            stepSize: 5,
            color1: 33,
            color2 : 198,
            color3: 237,
            foodGain: 20
        }
        let ants = [ant1, ant2];
        const color = 20;
        this.setState({ants: ants});
        window.requestAnimationFrame(() => {this.gameLoop(color, ants, false)});
        return;
    }

    

    componentDidMount(){
        const canvas = document.getElementById('testgame');
        const ctx = canvas.getContext('2d');
        //document.addEventListener('keydown' ,this.handleInput);
        this.startSim();
    }

    parseMove(){

    }

    
    intersectRect(r1, r2) {
        return !(r2.left > r1.right || 
                 r2.right < r1.left || 
                 r2.top > r1.bottom ||
                 r2.bottom < r1.top);
      }


    gameLoop(color, ants, stopAfterRun){
        if(stopAfterRun){
            return;
        }
        if(this.state.paused){
            window.requestAnimationFrame(() => {this.gameLoop(color + 5, ants, false)});
            return;
        }

        color = color % 220;
        const canvas = document.getElementById('testgame');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 600, 600);

        let removed = [];
        for(let i = 0; i < ants.length; i++){
            ants[i].age += 1;
            if(ants[i].age >= ants[i].maxAge){
                removed.push(i);
                //continue;
            }
    
            //change movement function so that it doesnt
            //only go left and right


            /*for(let j = 0; j < ants[i].probs.length; j++){
                rand -= ants[i].probs[j];
                if(rand <= 0){
                    //move ant in direction 
                    if(j === 0){
                        ants[i].x -= 2;
                    } else if(j === 1){
                        ants[i].x += 2;
                    } else if(j === 2){
                        ants[i].y -= 2;
                    } else if(j === 3){
                        ants[i].y += 2;
                    }
                }
            } */

            if(Math.random() >= 0.5){
                if(Math.random() >= 0.5){
                    ants[i].x += ants[i].stepSize;
                    ants[i].x = Math.min(ants[i].x, 800);
                } else {
                    ants[i].x -= ants[i].stepSize;
                    ants[i].x = Math.max(ants[i].x, 0);

                }
            } else {
                if(Math.random() >= 0.5){
                    ants[i].y += ants[i].stepSize;
                    ants[i].y = Math.min(ants[i].y, 800);

                } else {
                    ants[i].y -= ants[i].stepSize;
                    ants[i].y = Math.max(ants[i].y, 0);
                }
            }
            if(ctx != null){
                ctx.fillStyle = 'rgb(' + ants[i].color1 + ',' + ants[i].color2 + ',' + ants[i].color3  + ')';
                ctx.fillRect(ants[i].x, ants[i].y, ants[i].size, ants[i].size);
            }
        }

        removed.sort((a,b) => { return b - a; });
        if(removed.length > 0){
            console.log('removed:', removed);

        }
        for(let i = 0; i < removed.length; i++){
            ants.splice(removed[i], 1);
        }
        let breed1 = Math.round(Math.random()*ants.length);
        if(breed1 >= ants.length){
            breed1 = breed1 - 1;
        }
        let breed2 = Math.round(Math.random()*ants.length);
        if(breed2 >= ants.length){
            breed2 = breed2 - 1;
        }
        if(breed1 !== breed2 && Math.random() < 0.3){
            let breedProb1 = Math.random();
            let breedProb2 = Math.random();
                
            if(ants[breed1].probs[4] < breedProb1 && ants[breed2].probs[4] < breedProb2){
                let parent1 = ants[breed1];
                let parent2 = ants[breed2];
                let newAnt = {
                    x: (parent1.x + parent2.x)/2,
                    y: (parent1.y + parent2.y)/2,
                    size: (Math.random()*parent1.size) + (Math.random()*parent2.size),
                    probs: [
                        (Math.random()*parent1.probs[0]) + (Math.random()*parent2.probs[0]), 
                        (Math.random()*parent1.probs[1]) + (Math.random()*parent2.probs[1]),  
                        (Math.random()*parent1.probs[2]) + (Math.random()*parent2.probs[2]), 
                        (Math.random()*parent1.probs[3]) + (Math.random()*parent2.probs[3]), 
                        (Math.random()*parent1.probs[4]) + (Math.random()*parent2.probs[4])
                    ],
                    color: (Math.random()*parent1.color) + (Math.random()*parent2.color),
                    maxAge: (Math.random()*parent1.maxAge) + (Math.random()*parent2.maxAge),
                    age: 0,
                    stepSize: (Math.random()*parent1.stepSize) + (Math.random()*parent2.stepSize),
                    color1: (Math.random()*parent1.color1) + (Math.random()*parent2.color1),
                    color2: (Math.random()*parent1.color2) + (Math.random()*parent2.color2),
                    color3: (Math.random()*parent1.color3) + (Math.random()*parent2.color3),
                }
                ants.push(newAnt);
            }
        }
        if(this.state.stopSim){
            this.setState({stopSim: false});
            window.setTimeout(() => {this.gameLoop(color+5, ants)}, this.state.delay, true);
        } else {
            window.setTimeout(() => {this.gameLoop(color+5, ants)}, this.state.delay, false);
        }
        //window.requestAnimationFrame(() => {this.gameLoop(color + 5, ants)});
    }

    setDelay(newDelay){
        this.setState({delay: newDelay});
    }

    pause(){
        this.setState({paused: true});
    }

    unpause(){
        this.setState({paused: false})
    }


    render(){
        return <div tabIndex={0}>
        <div width="100%">
            <canvas id="testgame" ref={this.myRef} width="600px" height="600px">
            </canvas>
        </div>
        <div>
            <button onClick={() => {this.pause()}}>Pause Sim</button>
            <button onClick={() => {this.unpause()}}>Unpause</button>
            <input id='delaySetter' type="number"></input>
            <button onClick={
                () => {
                    var newDelay = document.getElementById('delaySetter');
                    if(newDelay !== null && newDelay !== undefined){
                        if(newDelay.value > 0){
                            console.log('setting delay: ', newDelay.value);
                            this.setDelay(newDelay.value)
                            newDelay.innerText = '';
                        }
                    }
                }
            }>Set Delay</button>
            <button id="restartSim" onClick={() => {}}> Restart Sim</button>
        </div>    
        </div>
    }
}

class Background extends React.Component {
    render(){
        return <div className="ba">
            <TestGame></TestGame>
        </div>
    };
}

ReactDOM.render(<Background />, document.getElementById('root'));