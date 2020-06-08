import React from "react";
import {hostname, http_prefix} from "../utils";
import web_socket_connection from "../web_socket";


class Monster extends React.Component {

    state = {
        monster: {x:0, y:0}
    }
    is_mounted = false

    isSolid(){
        return this.props.monster.solid
    }

    constructor(props) {
        super(props);
        this.state.monster = props.monster
    }

    componentWillUnmount() {
        this.is_mounted = false
    }
    componentDidMount() {
        this.is_mounted = true
        web_socket_connection.objectEventBus.on("monster", monster => {
            if(!this.is_mounted) return
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
        let z = 0
        if(this.props.monster.type==="player" && this.props.monster.health > 0){
            z = 10
        }

        return <div style={{
            position: "absolute",
            width: s+"px",
            height: s+"px",
            zIndex: z,
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
        monsters: {},
        playerPosition: {x:0, y:0},
    }
    is_mounted = false

    componentWillUnmount() {
        this.is_mounted = false
    }
    componentDidMount() {
        this.is_mounted = true
        web_socket_connection.objectEventBus.on("monster", m => {
            if(!this.is_mounted) return

            let state = this.state
            if (m.action === "remove") {
                delete state.monsters[m.id]
            } else {
                state.monsters[m.id] = m
            }
            this.setState(state)
        })

        web_socket_connection.objectEventBus.on("player_position", (msg) => {
            if(!this.is_mounted) return
            let state = this.state
            state.playerPosition = msg
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
        return solid
    }

    render() {

        let playerPosition = this.state.playerPosition
        function makeObject(o, size) {
            return <Monster
                monster={o}
                key={o.id}
                id={o.id}
                size={size}
                playerPosition={playerPosition}
            />
        }

        let objects = [];
        Object.values(this.state.monsters).forEach(o => {
            if(o.type !== "player"){
                objects.push(makeObject(o, this.SIZE))
            }
        })
        Object.values(this.state.monsters).forEach(o => {
            if(o.type === "player"){
                objects.push(makeObject(o, this.SIZE))
            }
        })
        return <div className="monsters">
            {objects}
        </div>
    }


}

export default Monsters