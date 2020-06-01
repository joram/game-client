import React from 'react';
import GoogleLogin from 'react-google-login';
import './App.css';
import Player from "./components/player";
import Background from "./components/background";
import Objects from "./components/objects";
import Chat from "./components/chat";


class App extends React.Component {

    state = {
        accessToken: null,
        googleId: null
    }

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

    loginSuccess(data){
        let state = this.state
        state.accessToken = data.accessToken
        state.googleId = data.googleId
        this.setState(state)
    }

    renderLogin() {
        return <div style={{margin:"auto", width:"200px", paddingTop:"200px"}}>
            <GoogleLogin
                clientId="662193159992-4fv4hq3q25mkerlt0eqqr1ii670ogugr.apps.googleusercontent.com"
                onSuccess={this.loginSuccess.bind(this)}
                isSignedIn={true}
            />
        </div>
    }

    renderGame() {
        let size = 50;
        return <div>
            <Player
                size={size}
                background={this.background}
                objects={this.objects}
                ref={this.player}
                app={this}
                objectEventBus={this.objectEventBus}
                accessToken={this.state.accessToken}
                googleId={this.state.googleId}
            />
            <Background
                size={size}
                ref={this.background}
                app={this}
            />
            <Objects
                size={size}
                objectEventBus={this.objectEventBus}
                player={this.player}
                ref={this.objects}
            />
            <Chat/>
        </div>;
    }

    render(){
        if(this.state.accessToken === null){
            return this.renderLogin()
        }
        return this.renderGame()
    }


}

export default App;
