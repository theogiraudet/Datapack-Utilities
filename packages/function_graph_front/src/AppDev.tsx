import { useEffect, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow, useStore } from 'reactflow';
import 'reactflow/dist/style.css';
import { CircleNodeData, CustomCircleNode } from './custom_components/CircleNode';
import { data } from './data';
import { convertGraphToFlow } from './GraphConverter';
import { forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import FloatingEdge from './custom_components/FloatingEdge';

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-70))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .stop();

const { nodes: initialNodes, edges: initialEdges } = convertGraphToFlow(data);

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

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [initialised, values] = useLayoutedElements();

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
      onlyRenderVisibleElements={true}
    >
      
      <Controls showInteractive={false} />
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};

export function AppDev() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}