import { useCallback, useState } from 'react';
import ReactFlow, { NodeChange, applyNodeChanges, Controls, Background, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import './custom-nodes.css';
import { CustomCircleNode } from './CircleNode';
import { data } from './data';
import { convertGraphToFlow } from './GraphConverter';


interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

// const initialNodes: CircleNode[] = [
//   { id: 'node-1', type: 'circle', position: { x: 0, y: 0 }, data: { color: 'default', fade: false }, draggable: false },
// ];

const initialNodes = convertGraphToFlow(data);

const nodeTypes = { circle: CustomCircleNode };

export function AppReactFlow() {
  const [nodes, setNodes] = useState(initialNodes);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  console.log(nodes.length);

  // useEffect(() => {
  //   console.log("useEffect");
  //   console.log("Ask for graph")
  //   const askGraph: AskGraphQuery = {payloadName: 'ask_graph'};
  //   vscode.postMessage(askGraph);
  //   window.addEventListener('message', event => { 
  //     console.log("Receive graph");
  //     if(isQuery(event.data) && event.data.payloadName === 'graph_payload') { 
  //       //setGraph(event.data.graph)
  //     } 
  //   })
  // }, [])

  return (
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls showInteractive={false} />
        <Background />
        <MiniMap />
      </ReactFlow>
  );
}
