import React from "react";

class BaseObject extends React.Component {

    render() {
        let x = this.props.x
        let y = this.props.y
        let size = 50;
        let squaresTall = Math.ceil(window.innerHeight/size);
        let squaresWide = Math.ceil(window.innerWidth/size);
        let offsetX = -this.props.playerPosition.x + Math.floor(squaresWide/2)
        let offsetY = -this.props.playerPosition.y + Math.floor(squaresTall/2)
        return <div style={{
            position: "absolute",
            width: size+"px",
            height: size+"px",
            zIndex: this.props.zIndex,
            left: size*(x+offsetX)+"px",
            top: size*(y+offsetY)+"px",
        }}>
            {this.props.children}
        </div>
    }
}

export default BaseObject;