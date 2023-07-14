import { useEffect, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow, useStore, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { CircleNodeData, CustomCircleNode } from './custom_components/CircleNode';
import { convertGraphToFlow } from './GraphConverter';
import { forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import FloatingEdge from './custom_components/FloatingEdge';
import { AskGraphQuery, isQuery } from './protocol_messages';


export interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-70))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .stop();

const nodeTypes = { circle: CustomCircleNode };
const edgeTypes = {
  floating: FloatingEdge,
};

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges } = useReactFlow<CircleNodeData, any>();
  const initialised = useStore((store) =>
    [...store.nodeInternals.values()].every((node) => node.width && node.height)
  );

  return useMemo(() => {
    const nodes = getNodes().map((node) => ({ ...node, x: node.position.x, y: node.position.y }));
    const edges = getEdges().map((edge) => edge);
    let running = false;

    if (!initialised || nodes.length === 0) return [false, {}];

    simulation.nodes(nodes).force(
      'link',
      forceLink(edges).id((d: any) => d.id)
      .distance(50)
      .strength(0.3)
      );

    const tick = () => {
      getNodes().forEach((node, i) => {
        const dragging = Boolean(document.querySelector(`[data-id="${node.id}"].dragging`));

        (nodes[i] as any).fx = dragging ? node.position.x : null;
        (nodes[i] as any).fy = dragging ? node.position.y : null;
      });

      simulation.tick();
      setNodes(nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })));

      window.requestAnimationFrame(() => {
        if (running) tick();
      });
    };

    const toggle = () => {
      running = !running;
      running && window.requestAnimationFrame(tick);
    };

    const isRunning = () => running;

    return [true, { toggle, isRunning }];
  }, [initialised]);
};


export const LayoutFlow = () => {

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [initialised, values] = useLayoutedElements();

  useEffect(() => {
    const askGraph: AskGraphQuery = {payloadName: 'ask_graph'};
    vscode.postMessage(askGraph);
    window.addEventListener('message', event => { 
      if(isQuery(event.data) && event.data.payloadName === 'graph_payload') {
        const { nodes, edges } = convertGraphToFlow(event.data.graph, vscode)
        console.log(event.data.graph)
        setNodes(nodes)
        setEdges(edges)
      } 
    })
  }, [])

  useEffect(() => { if(initialised) (values as any).toggle() }, [initialised, values]);

  return (
    <ReactFlow
    className='floatingedges'
      nodes={nodes}
      edges={edges}
      onNodesChange={(change) => { onNodesChange(change) }}
      onEdgesChange={onEdgesChange}
      proOptions={{hideAttribution: true}}
      elementsSelectable={true}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={0.3}
      maxZoom={3}
    >
      
      <Controls showInteractive={true} />
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};

export function App() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}


// export function AppReactFlow() {
//   const [graph, setNodes] = useState(initialNodes);

//   // const onNodesChange = useCallback(
//   //   (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
//   //   [setNodes]
//   // );

//   // useEffect(() => {
//   //   console.log("useEffect");
//   //   console.log("Ask for graph")
//   //   const askGraph: AskGraphQuery = {payloadName: 'ask_graph'};
//   //   vscode.postMessage(askGraph);
//   //   window.addEventListener('message', event => { 
//   //     console.log("Receive graph");
//   //     if(isQuery(event.data) && event.data.payloadName === 'graph_payload') { 
//   //       //setGraph(event.data.graph)
//   //     } 
//   //   })
//   // }, [])

//   return (
//       <ReactFlow
//         nodes={graph.nodes}
//         edges={graph.edges}
//         // onNodesChange={onNodesChange}
//         nodeTypes={nodeTypes}
//         fitView
//       >
//         <Controls showInteractive={false} />
//         <Background />
//         <MiniMap />
//       </ReactFlow>
//   );
// }
