import { displayLoader, renderGraph } from "./graph_renderer"
import { Query, isQuery } from "./protocol_messages"

displayLoader()
window.addEventListener('message', event => { if(isQuery(event.data)) { dispatch(event.data) } else { console.warn("Invalid query: "); console.warn(event.data) }})

function dispatch(query: Query) {

    if(query.payloadName === "graph_payload") {
        renderGraph(query.graph);
    } else if(query.payloadName === "namespaces_payload") {

    } else {
        console.warn(`'${query.payloadName}' is not a valid query payload.`);
    }

}