import { Node } from 'reactflow';

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: Node, targetNode: Node) {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const vectorX = x1 - x2;
  const vectorY = y1 - y2;

  const div = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
  const vectorXNorm = vectorX / div;
  const vectorYNorm = vectorY / div;

  const vector2X = vectorXNorm * w;
  const vector2Y = vectorYNorm * w;

  const posX = x2 + vector2X;
  const posY = y2 + vector2Y;

  return { x: posX, y: posY};
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
  };
}
