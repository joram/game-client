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

        props.objectEventBus.on("object-update", object => {
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

        return <div style={{
            position: "absolute",
            width: s+"px",
            height: s+"px",
            zIndex: this.props.zIndex,
            left:s*(x-this.props.chunkPosition.x)+"px",
            top:s*(y-this.props.chunkPosition.y)+"px",
        }}>
            <img style={{width:`${s}px`, height:`${s}px`}} src={this.props.object.image} alt={this.props.object.type} />
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
                {/*({p.x}, {p.y})*/}
            </div>
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
                id={o.id}
                size={this.SIZE}
                chunkPosition={{x:this.props.data.x, y:this.props.data.y}}
                objectEventBus={this.props.objectEventBus}
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

    CHUNKSIZE = 10

    state = {
        playerPosition: {x:-99, y:-99},
        chunkData: {},
    }

    constructor(props) {
        super(props);
    }

    requestChunk(x, y) {
        if (this.state.chunkData[`${x}_${y}`] !== undefined ){
            return
        }

        // so we don't request again
        let state = this.state
        state.chunkData[`${x}_${y}`] = {pixels:[], objects:[]}
        this.setState(state)

        let url = `http://localhost:2303/chunks?x=${x}&y=${y}`
        fetch(url)
            .then(res => res.json())
            .then(chunkData => {
                let state = this.state
                state.chunkData[`${x}_${y}`] = chunkData
                this.setState(state)
            });
    }

    updateChunks(){
        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);

        let pp = this.playerPosition()
        let minX = Math.floor(pp.x - squaresWide/2)
        let minY = Math.floor(pp.y - squaresTall/2)
        let maxX = Math.ceil(pp.x + squaresWide/2)
        let maxY = Math.ceil(pp.y + squaresTall/2)

        minX = minX - minX%this.CHUNKSIZE - this.CHUNKSIZE
        minY = minY - minY%this.CHUNKSIZE - this.CHUNKSIZE
        maxX = maxX + maxX%this.CHUNKSIZE + this.CHUNKSIZE
        maxY = maxY + maxY%this.CHUNKSIZE + this.CHUNKSIZE

        let chunksWide = Math.ceil((maxX-minX)/this.CHUNKSIZE)
        let chunksTall = Math.ceil((maxY-minY)/this.CHUNKSIZE)

        let xIndex = [...Array(chunksWide).keys()]
        let yIndex = [...Array(chunksTall).keys()]
        xIndex.forEach(x => {
            yIndex.forEach(y => {
                if (this.state.chunkData[`${x}_${y}`] === undefined ){
                    this.requestChunk(minX+x*this.CHUNKSIZE,minY+y*this.CHUNKSIZE)
                }
           })
        })
    }

    playerPosition() {
        return this.props.app.playerPosition()
    }

    isSolidAt(p){

        let x = Math.floor(p.x/this.CHUNKSIZE)*this.CHUNKSIZE
        let y = Math.floor(p.y/this.CHUNKSIZE)*this.CHUNKSIZE
        let chunk = this.state.chunkData[`${x}_${y}`]
        if(chunk === undefined) {
            return false
        }
        let solid = false

        chunk.pixels.forEach(pixel => {
            if(Math.ceil(p.x) === pixel.x && Math.ceil(p.y) === pixel.y){
                if(pixel.g > 180){
                    solid = true
                }
            }
        })

        chunk.objects.forEach(object => {
            if(Math.ceil(p.x) === object.x && Math.ceil(p.y) === object.y){
                 if(object.solid){
                    solid = true
                }
            }
        })

        return solid
    }

    render() {
        this.updateChunks()

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
                objectEventBus={this.props.objectEventBus}
            />;
            chunks.push(chunk)
        })

        return (
            chunks
        );
    }
}

export default Chunks