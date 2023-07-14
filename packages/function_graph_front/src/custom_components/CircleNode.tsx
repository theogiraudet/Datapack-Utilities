import { useCallback, useState } from 'react';
import { Handle, Node, NodeProps, NodeToolbar, Position, useReactFlow } from 'reactflow';
import { Tooltip as ReactTooltip } from "react-tooltip";
import './custom_graph_elements.css';

export type Color = "red" | "default";

type ColorHtml = {
  [color in Color]: string
}

const colorHtml: ColorHtml = {
  red: "#BB5B5B",
  default: "#5B70BB"
}

export type CircleNodeData = {
  fade?: boolean;
  color: Color;
};

export type CircleNode = Node<CircleNodeData>;

export function CustomCircleNode({ id, data }: NodeProps<CircleNodeData>) {
  
  const { setEdges } = useReactFlow();
  const toggleAnimatedEdges = useCallback(
    (isAnimated: boolean) => {
      setEdges((edges) =>
        edges.map((edge) =>
          edge.source === id ? { ...edge, animated: isAnimated } : edge
        )
      );
    },
    [id, setEdges]
  );

  const [isVisible, setVisible] = useState(false);

  return (
    <>
      <div className="circle" 
          style={{backgroundColor: colorHtml[data.color], opacity: data.fade ? 0.5 : 1}}
          onMouseEnter={() => { toggleAnimatedEdges(true); setVisible(true) }}
          onMouseLeave={() => { toggleAnimatedEdges(false); setVisible(false) }}
          data-tooltip-id={`node-${id}`}
      >
        <Handle type="target" position={Position.Top} isConnectable={false}  />
        <Handle type="source" position={Position.Bottom} isConnectable={false} />
      </div>
      <NodeToolbar isVisible={isVisible} position={Position.Right}>
      <ReactTooltip
          id={`node-${id}`}
          place="right"
          variant="info"
          content={id}
          isOpen={isVisible}
        />
      </NodeToolbar>

  </>
  );
}