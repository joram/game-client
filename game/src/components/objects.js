import React from "react";

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


        return <div style={{
            position: "absolute",
            width: s+"px",
            height: s+"px",
            zIndex: this.props.zIndex,
            left:s*(x+offsetX)+"px",
            top:s*(y+offsetY)+"px",
        }}>
            <img style={{width:`${s}px`, height:`${s}px`}} src={this.props.object.image} alt={this.props.object.type} />
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
            let state = this.state
            state.objects[object.id] = object
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