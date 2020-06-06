import React from "react";
import {hostname, http_prefix} from "../utils";
import web_socket_connection from "../web_socket";

class Monster extends React.Component {

    state = {
        monster: {x:0, y:0}
    }

    isSolid(){
        return this.props.monster.solid
    }

    constructor(props) {
        super(props);
        this.state.monster = props.monster
    }

    componentDidMount(){
        web_socket_connection.objectEventBus.on("monster", monster => {
            if(this.props.id === monster.id){
                let state = this.state
                state.monster = monster
                this.setState(state)
            }
        })
    }

    render() {
        let p = this.state.monster
        let s = this.props.size
        let x = p.x
        let y = p.y
        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let offsetX = -this.props.playerPosition.x + Math.floor(squaresWide/2)
        let offsetY = -this.props.playerPosition.y + Math.floor(squaresTall/2)

        let images = []
        p.images.forEach(src => {
            images.push(<img style={{
                width: `${s}px`,
                height: `${s}px`,
                position: "absolute",
                left: "0px",
                top: "0px",
            }}
                 key={`${p.id}_img_${images.length}`}
                 src={`${http_prefix()}://${hostname()}${src}`}
                 alt={this.props.monster.type}
            />)

        })
        return <div style={{
            position: "absolute",
            width: s+"px",
            height: s+"px",
            zIndex: this.props.zIndex,
            left:s*(x+offsetX)+"px",
            top:s*(y+offsetY)+"px",
        }}>
            {images}
        </div>
    }
}

class Monsters extends React.Component {
    SIZE = 50

    state = {
        monsters: {}
    }

    componentDidMount(){
        web_socket_connection.objectEventBus.on("monster", object => {
            let state = this.state
            if (object.action === "remove") {
                delete state.monsters[object.id]
            } else {
                state.monsters[object.id] = object
            }
            this.setState(state)
        })
    }

    isSolidAt(p){
        let solid = false
        Object.values(this.state.monsters).forEach(monster => {
            if(Math.ceil(p.x) === monster.x && Math.ceil(p.y) === monster.y){
                 solid = solid || monster.solid
            }
        })
        console.log(solid)
        return solid
    }

    render() {

        let playerPosition = {x:0, y:0}
        if(this.props.player.current !== null){
            playerPosition = this.props.player.current.state.playerPosition
        }

        function makeObject(o, size, objectEventBus) {
            return <Monster
                monster={o}
                key={o.id}
                id={o.id}
                size={size}
                objectEventBus={objectEventBus}
                playerPosition={playerPosition}
            />
        }

        let objects = [];
        Object.values(this.state.monsters).forEach(o => {
            if(o.type !== "player"){
                objects.push(makeObject(o, this.SIZE, this.props.objectEventBus))
            }
        })
        Object.values(this.state.monsters).forEach(o => {
            if(o.type === "player"){
                objects.push(makeObject(o, this.SIZE, this.props.objectEventBus))
            }
        })
        return <div className="objects">
            {objects}
        </div>
    }


}

export default Monsters