import React from 'react';
import './App.css';
import Player from "./components/player";
import Chunks from "./components/chunk";

class App extends React.Component {

    state = {}

    constructor(props) {
        super(props);
        this.chunks = React.createRef();
        this.player = React.createRef();
    }

    playerPosition() {
        if(this.player.current===null){
            return {x:0, y:0}
        }
        return this.player.current.state.playerPosition
    }

    render() {
        let size = 50;
        return <div>
            <Player size={size} chunks={this.chunks} ref={this.player} app={this} />
            <Chunks size={size} ref={this.chunks} app={this} />
        </div>;
    }

}

export default App;
