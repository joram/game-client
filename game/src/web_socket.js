import {hostname, ws_prefix} from "./utils";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class WebSocketConnection {

    sendAccessToken(a,id, email,firstName, lastName){
        this.waitForConn(
            () => {
                let s = `{"accessToken":"${a}", "googleId":"${id}", "email":"${email}", "firstName":"${firstName}", "lastName":"${lastName}"}`
                this.ws.send(s)
            })
    }

    sendBackpackRequest(){
        this.waitForConn(
            () => {
                this.ws.send(`{"backpack":"please"}`)
            }
        )

    }

    sendPlayerMove(d){
        this.waitForConn(
            () => {
                this.ws.send(`{"direction":"${d}"}`)
            })
    }

    equipItem(id) {
        this.waitForConn(
            () => {
                this.ws.send(`{"equip_item":${id}}`)
            })
    }

    async waitForConn(callback){
        while(this.ws.readyState !== 1){
            await sleep(1);
        }
        callback()
    }

    processMessage(msg) {
        console.log("received msg on generic ws:", msg)

        // item
        if(msg["equipped_image"] !== undefined){
            this.objectEventBus.emit("item", null, msg)
        }

    }

    constructor() {
        this.objectEventBus = require('js-event-bus')();

        let url = `${ws_prefix()}://${hostname()}/objects`
        console.log(url)
        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
            console.log('connected to generic ws')
        }

        this.ws.onmessage = evt => {
            const message = JSON.parse(evt.data)
            this.processMessage(message)
        }

        this.ws.onclose = () => {
            console.log('disconnected generic ws')
        }
    }
}


let web_socket_connection = new WebSocketConnection()

export default web_socket_connection