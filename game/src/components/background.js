import React from "react";
import {hostname, http_prefix} from "../utils";
import web_socket_connection from "../web_socket";

class Square extends React.Component {

    render() {
        let p = this.props.pixel
        let color = `rgb(${p.r}, ${p.g}, ${p.b})`
        let isSolid = this.props.pixel.g > 180
        if (isSolid) {
            color = `rgb(0, 80, 0)`
        }
        return <div style={{
                width: "50px",
                height: "50px",
                left: `${50*(p.x-this.props.chunkPosition.x)}px`,
                top: `${50*(p.y-this.props.chunkPosition.y)}px`,
                backgroundColor: color,
                position: "absolute"
            }}/>
    }
}

class Chunk extends React.Component {
    SIZE = 50;
    chunk = {}

    backgroundSquares() {
        let pixels = []
        // if(this.chunk.pixels === null || this.chunk.pixels === undefined) { return [] }
        this.props.data.pixels.forEach(pixel => {

            pixels.push(<Square
                key={pixel.x+"_"+pixel.y}
                pixel={pixel}
                chunkPosition={{x:this.props.data.x, y:this.props.data.y}}
            />)
        })
        return pixels
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
        </div>
    }
}

class Background extends React.Component {

    CHUNKSIZE = 10

    state = {
        chunkData: {},
        playerPosition: {x:0, y:0},
    }
    is_mounted = false

    componentWillUnmount() {
        this.is_mounted = false
    }

    componentDidMount(props) {
        this.is_mounted = true
        this.updateChunks()
        web_socket_connection.objectEventBus.on("player_position", (msg) => {
            if(!this.is_mounted) return
            let state = this.state
            state.playerPosition = msg
            this.setState(state)
            this.updateChunks()
        })

    }

    requestChunk(x, y) {
        if (this.state.chunkData[`${x}_${y}`] !== undefined ){
            return
        }

        // so we don't request again
        let state = this.state
        state.chunkData[`${x}_${y}`] = {pixels:[], objects:[]}
        this.setState(state)

        let url = `${http_prefix()}://${hostname()}/chunks?x=${x}&y=${y}`
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

        let pp = this.state.playerPosition
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

        return solid
    }

    render() {
        let chunks = [];
        let keys = Object.keys(this.state.chunkData)
        let playerPosition = this.state.playerPosition
        keys.forEach(key => {
            let chunkData = this.state.chunkData[key]
            let chunk = <Chunk
                x={chunkData.x}
                y={chunkData.y}
                key={key}
                data={chunkData}
                playerPosition={playerPosition}
            />;
            chunks.push(chunk)
        })

        return (<div id="chunks">
            {chunks}
        </div>);
    }
}

export default Background