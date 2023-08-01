import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  Panel,
  Edge,
  Node
} from "reactflow";
import "reactflow/dist/style.css";
import {
  CircleNodeData,
  CustomCircleNode,
} from "./custom_components/CircleNode";
import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import FloatingEdge, { FloatingEdgeData } from "./custom_components/FloatingEdge";
import DataManager from "./graph_providers/DataManager";
import { Toolbar } from "./custom_components/Toolbar";
import { Graph } from "./models/model";
import { update } from "./utils";

const simulation = forceSimulation()
  .force("charge", forceManyBody().strength(-70))
  .force("x", forceX().x(0).strength(0.05))
  .force("y", forceY().y(0).strength(0.05))
  .stop()

const nodeTypes = { circle: CustomCircleNode };
const edgeTypes = {
  floating: FloatingEdge,
};

const useLayoutedElements = (graph: Graph) => {
  const { getNodes, setNodes, getEdges } = useReactFlow<CircleNodeData, FloatingEdgeData>();
  const initialised = useStore((store) =>
    [...store.nodeInternals.values()].every((node) => node.width && node.height)
  );

  const [animationFrame, setAnimationFrame] = useState(0)

  const convert = (node: Node<CircleNodeData>) => ({
    ...node,
    x: node.position.x,
    y: node.position.y,
  })


  // console.log(graph.nodes.length)

  return useMemo(() => {
    let running = false;

    const nodes = getNodes().map(convert);
    const edges = getEdges().map(edge => edge);

    const tick = () => {

      const newNodes = update(nodes, getNodes(), convert)
      simulation.tick();
      // Issue here: setNodes is executed with old instance of nodes with all nodes.
      setNodes(
        newNodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } }))
      );

      setAnimationFrame(window.requestAnimationFrame(() => {
        if (running) tick();
      }));
    };

    const toggle = () => {
      running = !running;
      running && setAnimationFrame(window.requestAnimationFrame(tick));
    };

    // window.cancelAnimationFrame(animationFrame)
    // if(running) {
    //   setAnimationFrame(window.requestAnimationFrame(tick));
    // }



    if (!initialised || nodes.length === 0) return [false, {}];

    simulation.nodes(nodes).force(
      "link",
      forceLink(edges)
        .id((d: any) => d.id)
        .distance(50)
        .strength(0.3)
    );


    const isRunning = () => running;
    console.log("Use memo")
    console.log(`>>> ${getNodes().length}`)
    console.log(`>>> ${getEdges().length}`)

    return [true, { toggle, isRunning }];
  }, [initialised, graph]);
};

export type AppProps = {
  provider: DataManager;
};

export const LayoutFlow = ({ provider: dataManager }: AppProps) => {

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => dataManager.getGraphInitialState(), [dataManager]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [graph, setGraph] = useState<Graph>({ edges: initialEdges, nodes: initialNodes});
  const [namespaces, setNamespaces] = useState(dataManager.getInitialNamespaces());

  const [initialised, values] = useLayoutedElements(graph);

  useEffect(() => {
    dataManager.onNamespacesChange((loadedNamespaces, namespaces) => {
      setNamespaces({allNamespaces: namespaces, loadedNamespaces})
      // console.log(loadedNamespaces)
    })
    dataManager.onGraphChange((graph) => {
      // if (initialised) (values as any).toggle();
      setNodes(graph.nodes);
      console.log(`???? ${graph.nodes.length}`)
      setEdges(graph.edges);
      setGraph(graph);
    });
  }, []);

  // console.log(`!!!!! ${nodes.length}`)

  useEffect(() => {
    // console.log(useEffect)
    if (initialised) (values as any).toggle();
  }, [initialised, graph]);

  return (
    <ReactFlow
      className="floatingedges"
      nodes={nodes}
      edges={edges}
      onNodesChange={(change) => {
        onNodesChange(change);
      }}
      onEdgesChange={onEdgesChange}
      proOptions={{ hideAttribution: true }}
      elementsSelectable={true}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={0.3}
      maxZoom={3}
      onlyRenderVisibleElements={true}
    >
      <Panel position="top-left" >
        <Toolbar loadedNamespaces={namespaces.loadedNamespaces} namespaces={namespaces.allNamespaces} dataManager={dataManager}/>
      </Panel>
      <Controls showInteractive={false} />
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};



export function App({ provider }: AppProps) {
  return (
      <ReactFlowProvider>
        <LayoutFlow provider={provider} />
      </ReactFlowProvider>
  );
}
