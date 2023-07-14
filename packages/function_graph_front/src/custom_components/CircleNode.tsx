import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { Handle, Node, NodeProps, NodeToolbar, Position, useReactFlow } from 'reactflow';
import { Tooltip as ReactTooltip } from "react-tooltip";
import './custom_graph_elements.css';
import { vscode } from '../App';

export type Color = "undefined" | "default";

type ColorHtml = {
  [color in Color]: string
}

const colorHtml: ColorHtml = {
  undefined: "#BB5B5B",
  default: "#5B70BB"
}

export type CircleNodeData = {
  fade?: boolean;
  color: Color;
  filePath?: string
  vscode?: vscode
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
  const [pressed, setPressed] = useState(false)

  const onClickHandler:  MouseEventHandler<HTMLDivElement> = (event) => {
    if(event.ctrlKey && data.vscode && data.filePath) {
      data.vscode.postMessage({ payloadName: "ask_open_file", filePath: data.filePath })
      setPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", (event) => { if(event.key === "Control") setPressed(true) })
    window.addEventListener("keyup", (event) => { if(event.key === "Control") setPressed(false) })
  }, []) 

  let className = ""
  if(pressed && isVisible) {
    console.log("pressed " + id)
    className = "circle goto"
  } else {
    className = "circle"
  }

  return (
    <>
      <div className={className} 
          style={{backgroundColor: colorHtml[data.color], opacity: data.fade ? 0.5 : 1}}
          onMouseEnter={() => { toggleAnimatedEdges(true); setVisible(true) }}
          onMouseLeave={() => { toggleAnimatedEdges(false); setVisible(false) }}
          data-tooltip-id={`node-${id}`}
          onClick={onClickHandler}
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