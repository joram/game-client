import React from "react";

class GameObject extends React.Component {

    isSolid(){
        return this.props.object.solid
    }

    render() {
        let p = this.props.object
        let s = this.props.size
        let x = p.x
        let y = p.y

        return <div style={{
            position: "absolute",
            width: s+"px",
            height: s+"px",
            zIndex: this.props.zIndex,
            left:s*(x-this.props.chunkPosition.x)+"px",
            top:s*(y-this.props.chunkPosition.y)+"px",
        }}>
            <img src={this.props.object.image} alt={this.props.object.type} />
        </div>
    }
}

class Square extends React.Component {

    isSolid(){
        return this.props.pixel.g > 180
    }

    render() {
        let p = this.props.pixel
        let color = `rgb(${p.r}, ${p.g}, ${p.b})`
        if (this.isSolid()) {
            color = `rgb(0, 80, 0)`
        }
        return <div style={{
                width: "50px",
                height: "50px",
                left: `${50*(p.x-this.props.chunkPosition.x)}px`,
                top: `${50*(p.y-this.props.chunkPosition.y)}px`,
                backgroundColor: color,
                position: "absolute"
            }}>
                ({p.x}, {p.y})
            </div>
        // </BaseObject>
    }
}

class Chunk extends React.Component {
    SIZE = 50;
    chunk = {}
    state = {}

    backgroundSquares() {
        let pixels = []
        // if(this.chunk.pixels === null || this.chunk.pixels === undefined) { return [] }
        this.props.data.pixels.forEach(pixel => {

            pixels.push(<Square
                key={pixel.x+"_"+pixel.y}
                pixel={pixel}
                chunkPosition={{x:this.props.data.x, y:this.props.data.y}}
                playerPosition={this.props.playerPosition}
            />)
        })
        return pixels
    }

    isSolidAt(p) {
        console.log("checking solid at ", p)
        console.log(this.chunk)
    }

    objects(){
        let objectComponents = [];
        let objects = this.props.data.objects;
        if(objects === {} || objects === undefined){
            objects = [];
        }
        objects.forEach(o => {
            objectComponents.push(<GameObject
                object={o}
                key={o.id}
                size={this.SIZE}
                chunkPosition={{x:this.props.data.x, y:this.props.data.y}}
            />)
        })
        return objectComponents
    }

    render() {
        let x = this.props.x
        let y = this.props.y
        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let offsetX = -this.props.playerPosition.x + Math.floor(squaresWide/2)
        let offsetY = -this.props.playerPosition.y + Math.floor(squaresTall/2)

        return <div className="chunk" style={{
            // zIndex: "0",
            position: "absolute",
            border:"solid thin black",
            width: `${this.SIZE*this.chunk.size}px`,
            height: `${this.SIZE*this.chunk.size}px`,
            backgroundColor: "pink",
            left: size*(x+offsetX)+"px",
            top: size*(y+offsetY)+"px",

        }}>
            <div className="squares">{this.backgroundSquares()}</div>
            <div className="objects">{this.objects()}</div>
        </div>
    }
}

class Chunks extends React.Component {

    state = {
        playerPosition: {x:-99, y:-99},
        chunkData: {},
    }

    requestChunk(x, y) {
        let url = `http://localhost:2303/chunks?x=${x}&y=${y}`
        fetch(url)
            .then(res => res.json())
            .then(chunkData => {
                let state = this.state
                state.chunkData[`${x}_${y}`] = chunkData
                this.setState(state)
            });
    }

    constructor(props) {
        super(props);
        this.props = props;
        this.requestChunk(0,0)
        this.requestChunk(-5,-5)
    }

    playerPosition() {
        return this.props.app.playerPosition()
    }

    isSolidAt(p){
        let x = Math.floor(p.x/5)*5
        let y = Math.floor(p.y/5)*5
        let chunk = this.state.chunkData[`${x}_${y}`]

        let solid = false

        chunk.pixels.forEach(pixel => {
            if(Math.ceil(p.x) === pixel.x && Math.ceil(p.y) === pixel.y){
                console.log("considering", pixel)
                if(pixel.g > 180){ solid = true }
            }
        })

        return solid
    }

    render() {

        let chunks = [];
        let keys = Object.keys(this.state.chunkData)
        keys.forEach(key => {
            let chunkData = this.state.chunkData[key]
            let chunk = <Chunk
                x={chunkData.x}
                y={chunkData.y}
                key={key}
                playerPosition={this.playerPosition()}
                data={chunkData}
            />;
            chunks.push(chunk)
        })

        return (
            chunks
        );
    }
}

export default Chunks