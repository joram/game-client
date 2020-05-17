import React from 'react';
import './App.css';
import Player from "./components/player";
import Background from "./components/background";
import Objects from "./components/objects";
import Chat from "./components/chat";


class App extends React.Component {

    state = {}

    constructor(props) {
        super(props);
        this.background = React.createRef();
        this.objects = React.createRef();
        this.player = React.createRef();
        this.objectEventBus = require('js-event-bus')();
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
            <Player size={size} background={this.background} objects={this.objects} ref={this.player} app={this} objectEventBus={this.objectEventBus} />
            <Background size={size} ref={this.background} app={this}/>
            <Objects size={size} objectEventBus={this.objectEventBus} player={this.player} ref={this.objects} />
            <Chat/>
        </div>;
    }

}

export default App;
