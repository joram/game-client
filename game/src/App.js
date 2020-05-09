import React from 'react';
import './App.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';

class Square extends React.Component {
    
    isSolid(){

        return this.props.pixel.g > 180
    }

    render() {
        let p = this.props.pixel
        let s = this.props.size
        let x = p.x
        let y = p.y
        let color = `rgb(${p.r}, 0, ${p.b})`
        if (this.isSolid()) {
            color = `rgb(0, 80, 0)`
        }

      return <div style={{
          "position":"absolute",
          "width": s+"px",
          "height": s+"px",
          "border": "solid thin black",
          'left':s*x+this.props.offsetX+"px",
          'top':s*y+this.props.offsetY+"px",
          "backgroundColor": color
      }}>
      {/*({p.x}, {p.y})*/}
      {/*({p.r}, {p.g}, {p.b})</>;*/}
      </div>
}
}

function Circle(props) {
     let s = props.size;
     return <div style={{
         zIndex: "1",
         position: "absolute",
         backgroundColor: "black",
         borderRadius: "50%",
         width: s-2 + "px",
         height: s-2 + "px",
         left: s*props.x+1+"px",
         top: s*props.y+1+"px",
         border: "solid thin black"
     }} />
}

class Squares extends React.Component {

    state = {
        pixels: [],
        squares: [],
        playerPosition: {x:null, y:null}
    }

    updateSquares() {
        if (this.props.playerPosition.x === this.state.playerPosition.x &&
            this.props.playerPosition.y === this.state.playerPosition.y){
            console.log("already updated", this.state.playerPosition, this.props.playerPosition)
            return
        }
        console.log("updating", this.state.playerPosition, this.props.playerPosition)


        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let x1 = this.props.playerPosition.x - Math.floor(squaresWide/2)
        let x2 = this.props.playerPosition.x + Math.ceil(squaresWide/2) + 2
        let y1 = this.props.playerPosition.y - Math.floor(squaresTall/2)
        let y2 = this.props.playerPosition.y + Math.ceil(squaresTall/2) + 2
        let url = `http://localhost:2303/pixels?x1=${x1-1}&y1=${y1}&x2=${x2}&y2=${y2+1}`
        fetch(url)
            .then(res => res.json())
            .then(pixels => {
                let state = this.state
                state.pixels = pixels
                console.log("setting position", this.props.playerPosition)
                state.playerPosition.x = this.props.playerPosition.x
                state.playerPosition.y = this.props.playerPosition.y
                this.setState(state)
            });
    }

    render() {
        this.updateSquares()
        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let x1 = this.props.playerPosition.x - Math.floor(squaresWide/2)
        let y1 = this.props.playerPosition.y - Math.floor(squaresTall/2)

        let squares = [];
        this.state.pixels.forEach(pixel => {
            squares.push(<Square
                key={pixel.x+"_"+pixel.y}
                size={size}
                pixel={pixel}
                offsetX={-x1*size}
                offsetY={(-y1-1)*size}
            />)
        })

        return (
            <div style={{
                overflow:"hidden",
                position:"absolute",
                backgroundColor:"red",
                width:"100%",
                height:"100%",
            }}>
                {squares}
            </div>
        );
    }
}

class App extends React.Component {
    state = {
        playerPosition: {x: 10, y: 10}
    }

    render() {
        let size = 50;
        let squaresTall = Math.floor(window.innerHeight / size);
        let squaresWide = Math.floor(window.innerWidth / size);
        return <div>
            <Circle x={Math.floor(squaresWide / 2)} y={Math.floor(squaresTall / 2)} size={size}/>
            <Squares playerPosition={this.state.playerPosition}/>
            <KeyboardEventHandler
                handleKeys={["left", "right", "up", "down", "w", "a", "s", "d"]}
                onKeyEvent={(key, e) => {
                    let state = this.state
                    if (key === "left" || key === "a") {
                        state.playerPosition.x -= 1
                    }
                    if (key === "right" || key === "d") {
                        state.playerPosition.x += 1
                    }
                    if (key === "up" || key === "w") {
                        state.playerPosition.y -= 1
                    }
                    if (key === "down" || key === "s") {
                        state.playerPosition.y += 1
                    }
                    this.setState(state)
                }}/>
        </div>;
    }
}

export default App;
