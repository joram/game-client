function hostname() {
    let hostname = window.location.href.split("/")[2]
    if(hostname==="localhost:3000"){
        return "localhost:2303"
    }
    return hostname
}

function ws_prefix() {
    if(hostname()==="localhost:2303"){
        return "ws"
    }
    return "wss"
}

function http_prefix() {
    if(hostname()==="localhost:2303"){
        return "http"
    }
    return "https"
}

export {hostname, ws_prefix, http_prefix}