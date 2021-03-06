import React from 'react';
import GoogleLogin from 'react-google-login';
import './App.css';
import {Player} from "./components/player";
import Background from "./components/background";
import Monsters from "./components/monsters";
import Items from "./components/items";
import PlayerEditor from "./components/player_editor";
import web_socket_connection from "./web_socket"

class App extends React.Component {

    state = {
        accessToken: null,
        googleId: null,
        email: "",
        firstName: "",
        lastName: "",
        page: "game",
    }

    constructor(props) {
        super(props);
        this.background = React.createRef();
        this.monsters = React.createRef();
        this.items = React.createRef();
        this.player = React.createRef();
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

    setPage(name){
        let state = this.state
        state.page = name
        console.log(state)
        this.setState(state)
    }

    renderGame() {
        let size = 50;
        return <>
            <Background
                size={size}
                ref={this.background}
                app={this}
            />
            <Monsters
                size={size}
                // player={this.player}
                ref={this.monsters}
            />
            <Items
                size={size}
                // player={this.player}
                ref={this.items}
            />
            <Player
                size={size}
                background={this.background}
                items={this.items}
                ref={this.player}
                app={this}
                accessToken={this.state.accessToken}
                googleId={this.state.googleId}
                email={this.state.email}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
            />
        </>;
    }

    renderInventory(){
        return <PlayerEditor
            app={this}
            player={this.player}
            accessToken={this.state.accessToken}
            googleId={this.state.googleId}
            email={this.state.email}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
        />
    }

    render(){
        if(this.state.accessToken === null)
            return this.renderLogin()
        if(this.state.page==="game")
            return this.renderGame()
        if(this.state.page==="inventory")
            return this.renderInventory()
        return null
    }


}

export default App;
