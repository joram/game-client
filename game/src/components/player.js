import React from "react";
import _ from "lodash";
import KeyboardEventHandler from "react-keyboard-event-handler";
import web_socket_connection from "../web_socket";


class Player extends React.Component {

    state = {
        id: undefined,
        playerPosition: {x: 0, y: 0},
    }


    componentDidMount() {
        web_socket_connection.objectEventBus.on("player_id", (msg) => {
            let state = this.state
            state.id = msg["playerId"]
            this.setState(state)
        })

        web_socket_connection.objectEventBus.on("monster", (msg) => {
            if(msg["id"] === this.state.id) {
                let state = this.state
                state.playerPosition.x = msg["x"]
                state.playerPosition.y = msg["y"]
                this.setState(state)
            }

            let state = this.state
            let nextPlayerPosition = state.playerPosition
            if(msg.type==="player"){
                state.playerPosition = nextPlayerPosition
                state.nextPlayerPosition = nextPlayerPosition
                this.setState(state)
                this.props.background.current.updateChunks()

                let as = this.props.app.state;
                as.playerPosition = nextPlayerPosition
                this.props.app.setState(as)
            }
        })
    }

    movePlayer(key, e) {
        if (key === "e") {
            this.props.app.setPage("inventory")
        } else {
            if (key === "w") key = "up"
            if (key === "a") key = "left"
            if (key === "s") key = "down"
            if (key === "d") key = "right"
            this.props.background.current.updateChunks()
            web_socket_connection.sendPlayerMove(key)
        }
    }

    debouncedMovePlayer = _.debounce( (key, e, wait) => {
        this.movePlayer(key, e)
    }, 350, {leading:true, maxWait:350})

    render(){
        return <>
            <KeyboardEventHandler
                handleKeys={["left", "right", "up", "down", "w", "a", "s", "d", "e"]}
                onKeyEvent={(key, e) => {
                    this.debouncedMovePlayer(key, e, 100)
                }}
            />
            { this.props.children }
        </>
    }
}

export default Player