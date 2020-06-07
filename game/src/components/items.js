import React from "react";
import web_socket_connection from "../web_socket";
import {hostname, http_prefix} from "../utils";

class Item extends React.Component {

    state = {
        item: {x: 0, y: 0}
    }
    is_mounted = false

    constructor(props) {
        super(props);
        this.state.item = props.item
    }

    componentWillUnmount() {
        this.is_mounted = false
    }
    componentDidMount() {
        this.is_mounted = true

        web_socket_connection.objectEventBus.on("item", item => {
            if(!this.is_mounted) return
            if (this.props.id === item.id) {
                let state = this.state
                state.item = item
                this.setState(state)
            }
        })
    }

    render(){
        if(this.state.item.is_carried){
            return null
        }

        let p = this.state.item
        let s = this.props.size
        let x = p.x
        let y = p.y
        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let offsetX = -this.props.playerPosition.x + Math.floor(squaresWide/2)
        let offsetY = -this.props.playerPosition.y + Math.floor(squaresTall/2)

        return <div style={{
            position: "absolute",
            width: s+"px",
            height: s+"px",
            zIndex: 0,
            left:s*(x+offsetX)+"px",
            top:s*(y+offsetY)+"px",
        }}>
            <img style={{
                width: `${s}px`,
                height: `${s}px`,
                position: "absolute",
                left: "0px",
                top: "0px",
            }}
            src={`${http_prefix()}://${hostname()}${this.props.item.dropped_image}`}
            alt={this.props.item.type}
            />
        </div>
    }
}

class Items extends React.Component {
    SIZE = 50

    state = {
        items: {}
    }
    is_mounted = false

    componentWillUnmount() {
        this.is_mounted = false
    }
    componentDidMount() {
        this.is_mounted = true
        web_socket_connection.objectEventBus.on("item", item => {
            if(!this.is_mounted) return
            let state = this.state
            if (item.action === "remove") {
                delete state.items[item.id]
            } else {
                state.items[item.id] = item
            }
            this.setState(state)
        })
    }

    render() {
        let playerPosition = {x:0, y:0}
        if(this.props.player.current !== null){
            playerPosition = this.props.player.current.state.playerPosition
        }

        function makeObject(o, size) {
            return <Item
                playerPosition={playerPosition}
                item={o}
                key={o.id}
                id={o.id}
                size={size}
            />
        }

        let objects = [];
        Object.values(this.state.items).forEach(o => {
            if(o.type !== "player"){
                objects.push(makeObject.bind(this)(o, this.SIZE, this.props.objectEventBus))
            }
        })
        Object.values(this.state.items).forEach(o => {
            if(o.type === "player"){
                objects.push(makeObject(o, this.SIZE, this.props.objectEventBus))
            }
        })
        return <div className="objects">
            {objects}
        </div>
    }


}

export default Items