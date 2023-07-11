import { displayLoader, renderGraph } from "./graph_renderer"
import $ from 'jquery'

displayLoader()
$.get("/public/data.json", renderGraph)