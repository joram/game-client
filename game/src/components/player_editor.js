import React from "react";
import web_socket_connection from "../web_socket"
import { DndProvider,DragPreviewImage } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'

const SlotTypes = {
    1: "s1",
    2: "s2",
    3: "s3",
    4: "s4",
    5: "s5",
    6: "s6",
    7: "s7",
    8: "s8",
    BACKPACK: "backpack",
}

class PlayerEditor extends React.Component {

    componentDidMount() {
        web_socket_connection.sendBackpackRequest()
    }

    render() {
        return <>
            <DndProvider  backend={HTML5Backend}>
                <PlayerEditorEquip />
                <Backpack />
            </DndProvider>
        </>
    }
}


function DraggableItem(props) {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: SlotTypes[props.item.allowed_slot] },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                if(dropResult.name === "backpack"){
                    web_socket_connection.unequipItem(props.item.id)
                } else {
                    web_socket_connection.equipItem(props.item.id)
                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    return <>
        <DragPreviewImage connect={preview} src={props.item.dropped_image} />
        <div ref={drag} style={{...props.style}}>
            <img src={props.item.dropped_image} alt={props.item.name} />
        </div>
    </>
}


function ItemSlot(props) {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: SlotTypes[props.slot],
        drop: () => ({ name: `slot ${props.slot}` }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    let item = null
    if(props.item !== undefined) {
        item = <DraggableItem item={props.item} style={{...props.style}}/>
    }

    return <>
        <div ref={drop} style={{...props.style, backgroundColor }}>
            <img style={{
                width:"50px",
                height: "50px",
            }}
                 src="http://localhost:2305/images/gui/tab_unselected.png"
                 alt={`slot ${props.slot}`}
            />
        </div>
        {item}
    </>
}


function BackpackSlot(props) {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: Object.values(SlotTypes),
        drop: () => ({ name: `backpack` }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    let item = null

    return <>
        <div ref={drop} style={{width:"100%", height:"100%", border:"solid thin black", backgroundColor }}>
        </div>
        {item}
    </>
}


class Backpack extends React.Component {

    state = {
        items: {}
    }

    componentDidMount() {
        web_socket_connection.objectEventBus.on("item", item => {
            let state = this.state
            if(item["is_carried"] && !item["is_equipped"]) {
                state.items[item.id] = item
            } else {
                delete state.items[item.id]
            }
            this.setState(state)
        })
    }

    render() {
        let items = []
        Object.values(this.state.items).forEach( item => {
            items.push(<DraggableItem item={item} key={item.id}/>)
        })
        return <div style={{left:"300px", width: "300px", height: "290px", position: "absolute", border: "solid thin black"}}>
            <BackpackSlot />
            <div style={{position:"absolute", top:0, left:0}}>
                {items}
            </div>
        </div>
    }
}


class PlayerEditorEquip extends React.Component {

    state = {
        items: {}
    }

    componentDidMount() {
        web_socket_connection.objectEventBus.on("item", item => {
            let state = this.state
            if(item["is_carried"] && item["is_equipped"]) {
                state.items[item.equipped_slot] = item
            } else {
                delete state.items[item.allowed_slot]
            }
            this.setState(state)
        })
    }

    render() {
        let silhouette_style = {
            position: "absolute",
            width: "200px",
            height: "200px",
            left:"50px",
            top: "40px"
        }
        let items = []
        Object.values(this.state.items).forEach(item => {
            items.push(<img style={silhouette_style}
                 src={item.equipped_image}
                 alt="silhouette"
                 key={item.id}
            />)
        })
        return <div style={{width:"300px", height:"290px", position:"absolute", border: "solid thin black"}}>
            <img style={silhouette_style}
                 src="http://localhost:2305/images/player/base/human_m.png"
                 alt="silhouette"
            />
            {items}

            <ItemSlot style={{position: "absolute", left: "0px"}} slot={1} item={this.state.items[1]}/>
            <ItemSlot style={{position: "absolute", transform: "scaleX(-1)", right: "0px"}} slot={2} item={this.state.items[2]}/>

            <div style={{position: "absolute", top:"80px", width:"100%"}}>
                <ItemSlot style={{position: "absolute", left: "0px"}} slot={3} item={this.state.items[3]}/>
                <ItemSlot style={{position: "absolute", transform: "scaleX(-1)", right: "0px"}} slot={4} item={this.state.items[4]}/>
            </div>

            <div style={{position: "absolute", top:"160px", width:"100%"}}>
                <ItemSlot style={{position: "absolute", left: "0px"}} slot={5}/>
                <ItemSlot style={{position: "absolute", transform: "scaleX(-1)", right: "0px"}} slot={6}/>
            </div>

            <div style={{position: "absolute", top:"240px", width:"100%"}}>
                <ItemSlot style={{position: "absolute", left: "0px"}} slot={7}/>
                <ItemSlot style={{position: "absolute", transform: "scaleX(-1)", right: "0px"}} slot={8}/>
            </div>

        </div>
    }
}

export default PlayerEditor