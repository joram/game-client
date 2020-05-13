import React from 'react';
import './App.css';
import Squares from "./components/background";
import Player from "./components/player";

class GameObject extends React.Component {

    isSolid(){
        return this.props.object.solid
    }

    render() {
        let p = this.props.object
        let s = this.props.size
        let x = p.x
        let y = p.y

        return <div style={{
            position: "absolute",
            width: s+"px",
            height: s+"px",
            zIndex: this.props.zIndex,
            left:s*x+this.props.offsetX+"px",
            top:s*y+this.props.offsetY+"px",
        }}>
            <img src={this.props.object.image} alt={this.props.object.type} />
        </div>
    }
}

class Chunk extends React.Component {

    state = {}
    hasGotObjects = false
    getObjects() {
        if (this.hasGotObjects) {return}

        let url = `http://localhost:2303/chunks?x=${this.props.x}&y=${this.props.y}`
        fetch(url)
            .then(res => res.json())
            .then(chunk => {
                let state = this.state
                state.chunk = chunk
                this.setState(state)
                this.hasGotObjects = true
            });
    }

    render() {
        this.getObjects()
        if (!this.hasGotObjects) {
            return <div/>
        }
        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let x1 = this.props.playerPosition.x - Math.floor(squaresWide/2)
        let y1 = this.props.playerPosition.y - Math.floor(squaresTall/2)
        let objectComponents = [];

        let objects = this.state.chunk.objects;
        if(objects === {} || objects === undefined){
            objects = [];
        }
        objects.forEach(o => {
            objectComponents.push(<GameObject
                object={o}
                key={o.id}
                size={size}
                offsetX={-x1*size}
                offsetY={(-y1-1)*size}
            />)
        })
        return <div style={{
            zIndex: "1",
            position: "absolute",
        }}>
            {objectComponents}
        </div>
    }
}


class App extends React.Component {

    state = {}

    constructor(props) {
        super(props);
        this.squares = React.createRef();
        this.player = React.createRef();
    }

    playerPosition() {
        if(this.player.current===null){
            return {x:0, y:0}
        }
        return this.player.current.state.playerPosition
        // console.log(this.player.current.state.playerPosition)
        // return {x:0, y:0}
    }

    setPlayerPosition(p) {
        console.log("setting player pos", p)
    }

    render() {
        let size = 50;
        return <div>
            <Player size={size} squares={this.squares} ref={this.player} app={this}>
            </Player>
            <Chunk x={0} y={0} playerPosition={this.playerPosition()} />
            <Squares playerPosition={this.playerPosition()}  ref={this.squares}/>
        </div>;
    }

}

export default App;
