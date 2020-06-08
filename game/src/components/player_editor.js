import React from "react";
import web_socket_connection from "../web_socket"
import { DndProvider,DragPreviewImage } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'
import {hostname, http_prefix} from "../utils";
import KeyboardEventHandler from "react-keyboard-event-handler";

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
    GROUND: "ground",
}

class PlayerEditor extends React.Component {

    state = {
        items: [],
    }

    constructor(props) {
        super(props);
        web_socket_connection.sendBackpackRequest()
    }
    is_mounted = false

    componentWillUnmount() {
        this.is_mounted = false
    }
    componentDidMount() {
        this.is_mounted = true
        web_socket_connection.objectEventBus.on("item", item => {
            if (!this.is_mounted) return
            let state = this.state
            state.items[item.id] = item
            this.setState(state)
        })
    }

    equippedItems(){
        let items = []
        Object.values(this.state.items).forEach(item => {
            console.log(item)
            if(item.is_carried && item.is_equipped){
                items.push(item)
            }
        })
        console.log("equipped", items)
        return items
    }

    backpackItems(){
        let items = []
        Object.values(this.state.items).forEach(item => {
            if(item.is_carried && !item.is_equipped){
                items.push(item)
            }
        })
        console.log("backpack", items)
        return items
    }

    groundItems(){
        let items = []
        Object.values(this.state.items).forEach(item => {
            if(!item.is_carried && !item.is_equipped){
                items.push(item)
            }
        })
        console.log("ground", items)
        return items
    }


    render() {
        console.log("all_items", this.state.items)
        return <>
            <div style={{textAlign:"center"}}>
                <div style={{float:"left", width:"300px"}}>Equipped</div>
                <div style={{float:"left", width:"300px"}}>Backpack</div>
                <div style={{float:"left", width:"300px"}}>Ground</div>
            </div>
            <div  style={{top:"20px", position: "absolute"}} >
                <DndProvider backend={HTML5Backend}>
                    <PlayerEditorEquip items={this.equippedItems()} />
                    <Backpack items={this.backpackItems()} />
                    <Ground items={this.groundItems()} />
                </DndProvider>
            </div>
            <KeyboardEventHandler
                handleKeys={["esc", "e"]}
                onKeyEvent={(key, e) => {
                    this.props.app.setPage("game")
                }}
            />
        </>
    }
}


function DraggableItem(props) {
    console.log("draggable", props.item)
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: SlotTypes[props.item.allowed_slot] },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                if(dropResult.name === "backpack") {
                    web_socket_connection.unequipItem(props.item.id)
                } else if(dropResult.name === "ground"){
                    web_socket_connection.dropItem(props.item.id)
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
            <img src={`${http_prefix()}://${hostname()}/${props.item.dropped_image}`} alt={props.item.name} />
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
        item = <DraggableItem item={props.item} style={{...props.style, top:"10px", left:"10px"}}/>
    }

    return <>
        <div ref={drop} style={{...props.style, backgroundColor }}>
            <img style={{
                width:"50px",
                height: "50px",
            }}
                 src={`${http_prefix()}://${hostname()}/images/gui/tab_unselected.png`}
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

function GroundSlot(props) {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: Object.values(SlotTypes),
        drop: () => ({ name: `ground` }),
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

function Backpack(props) {
    let items = []
    Object.values(props.items).forEach( item => {
        items.push(<DraggableItem item={item} key={item.id}/>)
    })
    return <div style={{left:"300px", width: "300px", height: "290px", position: "absolute", border: "solid thin black"}}>
        <BackpackSlot />
        <div style={{position:"absolute", top:0, left:0}}>
            {items}
        </div>
    </div>
}

function PlayerEditorEquip(props) {
    let silhouette_style = {
        position: "absolute",
        width: "200px",
        height: "200px",
        left:"50px",
        top: "40px"
    }
    let items = {}
    let equipped_items = []
    Object.values(props.items).forEach(item => {
        items[item.allowed_slot] = item
        equipped_items.push(
            <img style={silhouette_style}
                 src={`${http_prefix()}://${hostname()}/${item.equipped_image}`}
                 alt="silhouette"
            />
        )
    })

    return <div style={{width:"300px", height:"290px", position:"absolute", border: "solid thin black"}}>
        <img style={silhouette_style}
             src={`${http_prefix()}://${hostname()}/images/player/base/human_m.png`}
             alt="silhouette"
        />
        {equipped_items}

        <ItemSlot style={{position: "absolute", left: "0px"}} slot={1} item={items[1]}/>
        <ItemSlot style={{position: "absolute", transform: "scaleX(-1)", right: "0px"}} slot={2} item={items[2]}/>

        <div style={{position: "absolute", top:"80px", width:"100%"}}>
            <ItemSlot style={{position: "absolute", left: "0px"}} slot={3} item={items[3]}/>
            <ItemSlot style={{position: "absolute", transform: "scaleX(-1)", right: "0px"}} slot={4} item={items[4]}/>
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

function Ground(props){
    let items = []
    Object.values(props.items).forEach( item => {
        items.push(<DraggableItem item={item} key={item.id}/>)
    })
    return <div style={{left:"600px", width: "300px", height: "290px", position: "absolute", border: "solid thin black"}}>
        <GroundSlot />
        <div style={{position:"absolute", top:0, left:0}}>
            {items}
        </div>
    </div>
}

export default PlayerEditor