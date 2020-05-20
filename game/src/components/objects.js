import React from "react";
import {hostname, http_prefix} from "../utils";

class GameObject extends React.Component {

    state = {
        object: {x:0, y:0}
    }

    isSolid(){
        return this.props.object.solid
    }

    constructor(props) {
        super(props);
        this.state.object = props.object
    }

    componentDidMount(){
        this.props.objectEventBus.on("object-update", object => {
            if(this.props.id === object.id){
                let state = this.state
                state.object = object
                this.setState(state)
            }
        })
    }

    render() {
        let p = this.state.object
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
                 alt={this.props.object.type}
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

class Objects extends React.Component {
    SIZE = 50

    state = {
        objects: {}
    }

    componentDidMount(){
        this.props.objectEventBus.on("object-update", object => {
            console.log("update:", object)
            let state = this.state
            if (object.action === "remove") {
                delete state.objects[object.id]
            } else {
                state.objects[object.id] = object
            }
            this.setState(state)
        })
    }

    isSolidAt(p){
        let solid = false
        Object.values(this.state.objects).forEach(object => {
            if(Math.ceil(p.x) === object.x && Math.ceil(p.y) === object.y){
                 if(object.solid){
                     solid = true
                }
            }
        })

        return solid
    }

    render() {

        let playerPosition = {x:0, y:0}
        if(this.props.player.current !== null){
            playerPosition = this.props.player.current.state.playerPosition
        }

        let objects = [];
        Object.values(this.state.objects).forEach(o => {
            objects.push(<GameObject
                object={o}
                key={o.id}
                id={o.id}
                size={this.SIZE}
                objectEventBus={this.props.objectEventBus}
                playerPosition={playerPosition}
            />)
        })
        return <div className="objects">
            {objects}
        </div>
    }


}

export default Objects