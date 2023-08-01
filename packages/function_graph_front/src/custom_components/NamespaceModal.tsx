import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import FolderIcon from "@mui/icons-material/Folder";
import SourceIcon from "@mui/icons-material/Source";
import { useEffect, useMemo } from 'react';
import { NamespaceId, namespaceToString } from '../models/model';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CustomTreeView, { TreeStruct } from './CustomTreeView';

export interface ConfirmationDialogRawProps {
  open: boolean;
  onClose: (loadedNamespaces?: NamespaceId[]) => void;
  namespaces: NamespaceId[]
  loadedNamespaces: NamespaceId[]
}

export function NamespaceSelectionDialog({open, onClose, namespaces, loadedNamespaces}: ConfirmationDialogRawProps) {
  const [value, setValue] = React.useState(loadedNamespaces);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  const namespaceTree: TreeStruct[] = useMemo(() => {
    const modules = new Map<string, NamespaceId[]>();
    for(const nms of namespaces) {
      const array = modules.get(nms.datapack) || []
      array.push(nms)
      modules.set(nms.datapack, array)
    }

    const nodes: TreeStruct[] = []
    for(const [ name, artifacts ] of modules) {
      nodes.push({
        id: name,
        name: name,
        checked: false,
        children: artifacts.map(nms => { return { id: namespaceToString(nms), checked: value.find(nms2 => namespaceToString(nms2) === namespaceToString(nms)) !== undefined, name: nms.namespace }})
      })
    }
    return nodes;
  }, [value, namespaces])

  useEffect(() => {
    if (!open) {
      setValue(loadedNamespaces);
    }
  }, [loadedNamespaces, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
    >
      <DialogTitle>Loaded namespaces</DialogTitle>
      <DialogContent dividers>
        <CustomTreeView 
          children={{ id: "root", name: "root", checked: false, children: namespaceTree}} 
          leafIcon={{ icon: <SourceIcon />, tooltip: "Namespace" }}
          parentIcon={{ icon: <FolderIcon />, tooltip: "Datapack" }}
          defaultExpanded={ namespaceTree.map(module => module.id) }
          onChange={ selected =>  setValue(namespaces.filter(nms => selected.includes(namespaceToString(nms)))) }
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
