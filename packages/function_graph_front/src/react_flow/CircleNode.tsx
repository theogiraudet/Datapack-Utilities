import { Node, NodeProps } from 'reactflow';

export type Color = "red" | "default";

type ColorHtml = {
  [color in Color]: string
}

const colorHtml: ColorHtml = {
  red: "#BB5B5B",
  default: "#5B70BB"
}

type CircleNodeData = {
  fade?: boolean;
  color: Color;
};

export type CircleNode = Node<CircleNodeData>;

export function CustomCircleNode({ data }: NodeProps<CircleNodeData>) {
  return (
    <div className="circle nodrag" style={{backgroundColor: colorHtml[data.color], opacity: data.fade ? 0.5 : 1}}>
    </div>
  );
}