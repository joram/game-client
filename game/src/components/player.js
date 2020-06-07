import React from "react";
import _ from "lodash";
import KeyboardEventHandler from "react-keyboard-event-handler";
import web_socket_connection from "../web_socket";

class Player extends React.Component {

    is_mounted = false

    componentWillUnmount() {
        this.is_mounted = false
    }
    componentDidMount() {
        this.is_mounted = true
        web_socket_connection.sendFullStateRequest()
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
        </>
    }
}

export {Player}