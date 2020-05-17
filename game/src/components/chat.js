import React from "react";

const { v4: uuidv4 } = require('uuid');

class ChatMessage extends React.Component {

    render(){
        return <div className="chat_message" style={{color:"white"}}>{this.props.message.from.substr(1, 6)}: {this.props.message.message}</div>
    }
}

class Chat extends React.Component {
    id = uuidv4();
    ws = new WebSocket("ws://localhost:2303/chat")
    state = {
        messages: [],
        text: "",
    }

    componentDidMount() {
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            this.ws.send(`{"id":"${this.id}", "message":"logged in"}`)
        }

        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)
            let state = this.state
            state.messages.push(message)
            this.setState(state)
        }

        this.ws.onclose = () => {
            console.log('disconnected')
        }
    }

    sendMessage(e, msg){
        e.preventDefault();
        console.log(this.state.text)
        this.ws.send(`{"id":"${this.id}", "message":"${this.state.text}"}`)
        let state = this.state
        state.text = ""
        this.setState(state)
    }

    textChange(event) {
        let state = this.state
        state.text = event.target.value
        this.setState(state)
    }

    render(){
        let messages = [];
        this.state.messages.forEach((msg, i) => {
            messages.push(<ChatMessage key={`msg_${i}`} message={msg} />)
        })

        return <div style={{
            width:"300px",
            height:"500px",
            backgroundColor: "rgba(20,20,20,0.8)",
            position: "absolute",
            top: "10px",
            left: "10px",
        }} >
            <div style={{color:"white"}}>{this.id.substr(1, 6)}</div>
            <div>
                {messages}
            </div>
            <form onSubmit={this.sendMessage.bind(this)}>
                <input type="text"
                       style={{
                           bottom: "6px",
                           left: "5px",
                           width: "185px",
                           position: "absolute"
                       }}
                       onChange={this.textChange.bind(this)}
                       value={this.state.text}
                />
            </form>
        </div>
    }
}

export default Chat