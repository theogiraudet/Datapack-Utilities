import React, { ReactElement, ReactNode, useMemo } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeItem } from "@mui/lab";
import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";


export interface TreeStruct {
    id: string;
    name: string;
    checked: boolean;
    children?: TreeStruct[];
  }

  export interface TreeItemIcon {
    icon: ReactElement,
    tooltip?: string
  }

export type CustomTreeViewProps = {
    children: TreeStruct,
    leafIcon?: TreeItemIcon,
    parentIcon?: TreeItemIcon,
    defaultExpanded?: string[]
    onChange: (selected: string[]) => void
}

function treeItemIconToReactNode(icon: TreeItemIcon): ReactNode {
  let result: ReactElement<any, any> | null = null
  if(icon) {
    result = icon.icon
    if(icon.tooltip) {
      result = (<Tooltip title={icon.tooltip}>{result}</Tooltip>)
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result = (<div style={{ marginRight: 5, display: "flex", justifyContent: "flex-start" }}> {result} </div>)
  }
  return result
}

function getSelected(nodes: TreeStruct): string[] {
  if(nodes.children?.length > 0) {
    return [...nodes.checked ? nodes.id : [], ...nodes.children.flatMap(getSelected)]
  } else {
    return nodes.checked ? [nodes.id] : []
  }
}

export default function CustomTreeView({ children, leafIcon, parentIcon, defaultExpanded, onChange: parentOnChange }: CustomTreeViewProps) {
  const [selected, setSelected] = React.useState<string[]>(getSelected(children));

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const parentMap = React.useMemo(() => {
    return goThroughAllNodes(children);
  }, []);

  const leafReactIcon: ReactNode | null = useMemo(() => treeItemIconToReactNode(leafIcon), [leafIcon])
  const parentReactIcon: ReactNode | null = useMemo(() => treeItemIconToReactNode(parentIcon), [parentIcon])


  function goThroughAllNodes(nodes: TreeStruct, map: Record<string, string[]> = {}) {
    if (!nodes.children) {
      return null;
    }

    map[nodes.id] = getAllChild(nodes).splice(1);

    for (const childNode of nodes.children) {
      goThroughAllNodes(childNode, map);
    }

    return map;
  }

  // Get all children from the current node.
  function getAllChild(
    childNode: TreeStruct | null,
    collectedNodes: string[] = []
  ) {
    if (childNode === null) return collectedNodes;

    collectedNodes.push(childNode.id);

    if (Array.isArray(childNode.children)) {
      for (const node of childNode.children) {
        getAllChild(node, collectedNodes);
      }
    }

    return collectedNodes;
  }

  const getChildById = (nodes: TreeStruct, id: string) => {
    const array: string[] = [];
    const path: string[] = [];

    // recursive DFS
    function getNodeById(node: TreeStruct, id: string, parentsPath: string[]): TreeStruct {
      let result: TreeStruct = null;

      if (node.id === id) {
        return node;
      } else if (Array.isArray(node.children)) {
        for (const childNode of node.children) {
          result = getNodeById(childNode, id, parentsPath);

          if (result) {
            parentsPath.push(node.id);
            return result;
          }
        }

        return result;
      }

      return result;
    }

    const nodeToToggle = getNodeById(nodes, id, path);

    return { childNodesToToggle: getAllChild(nodeToToggle, array), path };
  };

  function getOnChange(checked: boolean, nodes: TreeStruct) {
    const { childNodesToToggle, path } = getChildById(children, nodes.id);

    let array = checked
      ? [...selected, ...childNodesToToggle]
      : selected
          .filter((value) => !childNodesToToggle.includes(value))
          .filter((value) => !path.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);

    setSelected(array);
    parentOnChange(array)
  }

  const renderTree = (nodes: TreeStruct) => {
    const allSelectedChildren = parentMap[
      nodes.id
    ]?.every((childNodeId: string) => selectedSet.has(childNodeId));
    const checked = selectedSet.has(nodes.id) || allSelectedChildren || false;

    const indeterminate =
      parentMap[nodes.id]?.some((childNodeId: string) =>
        selectedSet.has(childNodeId)
      ) || false;

    if (allSelectedChildren && !selectedSet.has(nodes.id)) {

      setSelected([...selected, nodes.id]);
    }

    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <FormControlLabel
            control={
              <>
                <Checkbox
                  checked={checked}
                  indeterminate={!checked && indeterminate}
                  onChange={(event) =>
                    getOnChange(event.currentTarget.checked, nodes)
                  }
                  onClick={(e) => e.stopPropagation()}
                /> 
                {nodes.children?.length > 0 ? parentReactIcon : leafReactIcon}
              </>
            }
            label={<>{nodes.name}</>}
            key={nodes.id}
          />
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={defaultExpanded}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {children.children.map(renderTree)}
    </TreeView>
  );
}
