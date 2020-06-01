import React from "react";
import _ from "lodash";
import KeyboardEventHandler from "react-keyboard-event-handler";
import {hostname, ws_prefix} from "../utils";

class Player extends React.Component {

    state = {
        id: undefined,
        playerPosition: {x: 0, y: 0},
        // nextPlayerPosition: {x: 0, y: 0}
    }

    sendAccessToken(a,id){
        let s = `{"accessToken":"${a}", "googleId":"${id}"}`
        this.ws.send(s)
    }


    sendPlayerMove(d){
        let s = `{"direction":"${d}"}`
        this.ws.send(s)
    }

    componentDidMount() {
        let url = `${ws_prefix()}://${hostname()}/objects`
        console.log(url)
        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected to objects ws')
            this.sendAccessToken(this.props.accessToken, this.props.googleId)
            // this.sendPlayerCoordinates(this.state.playerPosition)
        }

        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)

            let playerId = message["playerId"]
            if(playerId !== undefined) {
                let state = this.state
                state.id = playerId
                this.setState(state)

            } else{
                this.props.objectEventBus.emit("object-update", null, message)
                if(message["id"] === this.state.id) {
                    let state = this.state
                    state.playerPosition.x = message["x"]
                    state.playerPosition.y = message["y"]
                    this.setState(state)
                }

            }


            let state = this.state
            let nextPlayerPosition = state.playerPosition
            if(message.type==="player"){
                state.playerPosition = nextPlayerPosition
                state.nextPlayerPosition = nextPlayerPosition
                this.setState(state)
                this.props.background.current.updateChunks()

                let as = this.props.app.state;
                as.playerPosition = nextPlayerPosition
                this.props.app.setState(as)
            }

        }

        this.ws.onclose = () => {
            console.log('disconnected')
        }
    }

    movePlayer(key, e) {
        if (key === "w") key = "up"
        if (key === "a") key = "left"
        if (key === "s") key = "down"
        if (key === "d") key = "right"

        this.props.background.current.updateChunks()
        this.sendPlayerMove(key)
    }

    debouncedMovePlayer = _.debounce( (key, e, wait) => {
        this.movePlayer(key, e)
    }, 350, {leading:true, maxWait:350})

    render(){
        return <>
            {/*<Circle*/}
            {/*    x={this.state.playerPosition.x}*/}
            {/*    y={this.state.playerPosition.y}*/}
            {/*    playerPosition={this.state.playerPosition} size={this.props.size}/>*/}
            <KeyboardEventHandler
                handleKeys={["left", "right", "up", "down", "w", "a", "s", "d"]}
                onKeyEvent={(key, e) => {
                    this.debouncedMovePlayer(key, e, 100)
                }}
            />
            { this.props.children }
        </>
    }
}

export default Player