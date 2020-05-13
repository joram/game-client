import React from "react";
import BaseObject from "./base_object";

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

        return <BaseObject x={p.x} y={p.y} playerPosition={this.props.playerPosition}>
            <div style={{
                width: "100%",
                height: "100%",
                backgroundColor: color
            }}>
                {/*({p.x}, {p.y})*/}
            </div>
        </BaseObject>
    }
}

class Squares extends React.Component {

    state = {
        pixels: [],
        squares: [],
        playerPosition: {x:-99, y:-99}
    }

    updateSquares() {
        if ( Math.floor(this.props.playerPosition.x) ===  Math.floor(this.state.playerPosition.x) &&
            Math.floor(this.props.playerPosition.y) ===  Math.floor(this.state.playerPosition.y)){
            return
        }


        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let x1 = Math.floor(this.props.playerPosition.x) - Math.floor(squaresWide/2)
        let x2 = Math.floor(this.props.playerPosition.x) + Math.ceil(squaresWide/2) + 2
        let y1 = Math.floor(this.props.playerPosition.y) - Math.floor(squaresTall/2)
        let y2 = Math.floor(this.props.playerPosition.y) + Math.ceil(squaresTall/2) + 2
        let url = `http://localhost:2303/pixels?x1=${x1-1}&y1=${y1}&x2=${x2}&y2=${y2+1}`
        console.log(url)
        fetch(url)
            .then(res => res.json())
            .then(pixels => {
                let state = this.state
                state.pixels = pixels
                state.playerPosition.x = this.props.playerPosition.x
                state.playerPosition.y = this.props.playerPosition.y
                this.setState(state)
            });
    }

    squares() {
        let squares = [];
        this.state.pixels.forEach(pixel => {
            squares.push(<Square
                key={pixel.x+"_"+pixel.y}
                pixel={pixel}
                playerPosition={this.props.playerPosition}
            />)
        })
        return squares
    }

    isSolidAt(position){
        let isSolid = false;
        this.state.pixels.forEach((p) => {
            if (p.x === Math.ceil(position.x) && p.y === Math.ceil(position.y) ){
                isSolid = p.g > 180
            }
        })
        return isSolid
    }

    render() {
        this.updateSquares()
        return (
            <div style={{
                overflow:"hidden",
                position:"absolute",
                backgroundColor:"red",
                width:"100%",
                height:"100%",
            }}>
                {this.squares()}
            </div>
        );
    }
}

export default Squares