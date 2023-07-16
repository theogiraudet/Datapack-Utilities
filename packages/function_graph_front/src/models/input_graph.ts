export type ArtifactNode = ResolvedArtifactNode | UnresolvedArtifactNode;

export type UnresolvedArtifactNode = {
  name: string;
  exist: false;
  qualifiedName: string;
  type: string;
};

export type ResolvedArtifactNode = {
  name: string;
  exist: true;
  qualifiedName: string;
  path: string;
  type: string;
};

export type ArtifactEdge = {
  srcQualifiedName: string;
  trgQualifiedName: string;
  line?: number;
  column?: number;
};

export type ArtifactGraph = {
  artifacts: ArtifactNode[];
  calls: ArtifactEdge[];
};
