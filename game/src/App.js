import React from 'react';
import GoogleLogin from 'react-google-login';
import './App.css';
import Player from "./components/player";
import Background from "./components/background";
import Objects from "./components/objects";
import Chat from "./components/chat";
import PlayerEditor from "./components/player_editor";
import web_socket_connection from "./web_socket"

class App extends React.Component {

    state = {
        accessToken: null,
        googleId: null,
        email: "",
        firstName: "",
        lastName: "",
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
        state.firstName = data.profileObj.givenName
        state.lastName = data.profileObj.familyName
        state.email = data.profileObj.email
        web_socket_connection.sendAccessToken(state.accessToken, state.googleId, state.email, state.firstName, state.lastName)
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
                email={this.state.email}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
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
        return <>
            <PlayerEditor
                player={this.player}
                accessToken={this.state.accessToken}
                googleId={this.state.googleId}
                email={this.state.email}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
            />
        </>
        // return this.renderGame()
    }


}

export default App;
