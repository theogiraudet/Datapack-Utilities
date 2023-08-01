import {
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import SourceIcon from "@mui/icons-material/Source";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Sling as Hamburger } from "hamburger-react";
import { useMemo, useState } from "react";
import "./custom_graph_elements.css";
import { NamespaceSelectionDialog } from "./NamespaceModal";
import { NamespaceId } from "../models/model";
import DataManager from "../graph_providers/DataManager";

export type ToolbarProps = {
    namespaces: NamespaceId[]
    loadedNamespaces: NamespaceId[]
    dataManager: DataManager
}

export function Toolbar({ namespaces, loadedNamespaces, dataManager }: ToolbarProps) {
  const [open, setOpen] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const selectionDialog = useMemo(() => (
    <NamespaceSelectionDialog
        open={openDialog}
        onClose={(namespaces) => { if(namespaces) { dataManager.loadNamespaces(namespaces); } setOpenDialog(false); }}
        namespaces={namespaces}
        loadedNamespaces={loadedNamespaces}
    />
  ), [openDialog, namespaces, loadedNamespaces, dataManager])

  return (
    <>
    {selectionDialog}
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      icon={<Hamburger toggled={open} size={18} />}
      direction="down"
      open={open}
      onOpen={(e) =>  { if(e.type !== "focus") setOpen(true) } }
      onClose={() => setOpen(false)}
      FabProps={{
        sx: {
          bgcolor: "hsl(30, 95%, 59%)",
          "&:hover": {
            bgcolor: "hsl(30, 95%, 49%)",
          },
        },
      }}
    >
      <SpeedDialAction
        key="0"
        icon={<SourceIcon />}
        tooltipTitle="Change loaded namespaces"
        onClick={() => setOpenDialog(true)}
      />
      <SpeedDialAction
        key="1"
        icon={<RefreshIcon />}
        tooltipTitle="Refresh"
      />
    </SpeedDial>
    </>
  );
}
