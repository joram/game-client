import React from "react";
import _ from "lodash";
import KeyboardEventHandler from "react-keyboard-event-handler";
import {hostname, ws_prefix} from "../utils";

class Player extends React.Component {

    state = {
        playerPosition: {x: 0, y: 0},
        nextPlayerPosition: {x: 0, y: 0}
    }


    sendPlayerCoordinates(){
        let s = `{"x":${this.state.playerPosition.x}, "y":${this.state.playerPosition.y}}`
        this.ws.send(s)
    }

    componentDidMount() {
        let url = `${ws_prefix()}://${hostname()}/objects`
        console.log(url)
        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected to objects ws')
            this.sendPlayerCoordinates()
        }

        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)
            this.props.objectEventBus.emit("object-update", null, message)
        }

        this.ws.onclose = () => {
            console.log('disconnected')
        }
    }

    movePlayer(key, e) {
        let offset = 1
        let nextPlayerPosition = {x: this.state.playerPosition.x, y: this.state.playerPosition.y}

        function move(position, key, offset) {
            if (["left","a"].includes(key)) {
                position.x -= offset
            }
            if (key === "right" || key === "d") {
                position.x += offset
            }
            if (key === "up" || key === "w") {
                position.y -= offset
            }
            if (key === "down" || key === "s") {
                position.y += offset
            }

            return position
        }

        if(["left", "a", "up", "w"].includes(key)) {
            nextPlayerPosition = move(nextPlayerPosition, key, 1)
        }
        nextPlayerPosition = move(nextPlayerPosition, key, offset/2)
        let isSolid = this.props.background.current.isSolidAt(nextPlayerPosition)
        isSolid = isSolid || this.props.objects.current.isSolidAt(nextPlayerPosition)

        nextPlayerPosition = move(nextPlayerPosition, key, offset/2)
        if(["left", "a", "up", "w"].includes(key)) {
            nextPlayerPosition = move(nextPlayerPosition, key, -1)
        }

        let x_units = Math.round(nextPlayerPosition.x/offset)
        let y_units = Math.round(nextPlayerPosition.y/offset)
        nextPlayerPosition.x = x_units*offset
        nextPlayerPosition.y = y_units*offset

        if(!isSolid){
            let state = this.state
            state.playerPosition = nextPlayerPosition
            state.nextPlayerPosition = nextPlayerPosition
            this.setState(state)

            // let ss = this.props.squares.current.state;
            // ss.playerPosition = nextPlayerPosition
            // this.props.squares.current.setState(ss)

            let as = this.props.app.state;
            as.playerPosition = nextPlayerPosition
            this.props.app.setState(as)

            this.sendPlayerCoordinates()
            this.props.background.current.updateChunks()
        }
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