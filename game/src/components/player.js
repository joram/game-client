import BaseObject from "./base_object";
import React from "react";
import _ from "lodash";
import KeyboardEventHandler from "react-keyboard-event-handler";

function Circle(props) {
    let s = props.size;
    return <BaseObject x={props.x} y={props.y} playerPosition={props.playerPosition} zIndex={10}>
        <div style={{
            backgroundColor: "black",
            borderRadius: "50%",
            width: s + "px",
            height: s + "px",
        }} />
    </BaseObject>
}

class Player extends React.Component {

    state = {
        playerPosition: {x: 0, y: 0},
        nextPlayerPosition: {x: 0, y: 0}
    }

    ws = new WebSocket("ws://localhost:2303/objects")

    sendPlayerCoordinates(){
        let s = `{"x":"${this.state.playerPosition.x}", "y":"${this.state.playerPosition.y}"}`
        console.log(s)
        this.ws.send(s)
    }

    componentDidMount() {
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
        let offset = 0.2
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
        let isSolid = this.props.chunks.current.isSolidAt(nextPlayerPosition)

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
        }
    }

    debouncedMovePlayer = _.debounce( (key, e, wait) => {
        this.movePlayer(key, e)
    }, 150, {leading:true, maxWait:150})

    render(){
        return <>
            <Circle
                x={this.state.playerPosition.x}
                y={this.state.playerPosition.y}
                playerPosition={this.state.playerPosition} size={this.props.size}/>
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