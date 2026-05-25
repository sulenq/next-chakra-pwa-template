export type ActivityActionType =
  (typeof activityAction)[keyof typeof activityAction];

export const activityAction = {
  CREATE_WORKSPACE: "CREATE_WORKSPACE",
  UPDATE_WORKSPACE: "UPDATE_WORKSPACE",
  DELETE_WORKSPACE: "DELETE_WORKSPACE",

  CREATE_LAYER: "CREATE_LAYER",
  UPDATE_LAYER: "UPDATE_LAYER",
  DELETE_LAYER: "DELETE_LAYER",
} as const;

// -----------------------------------------------------------------

export const activityActionTemplates: Record<
  string,
  (meta?: Record<string, any>) => string
> = {
  // TODO_DEV create action sentence glosary
  [activityAction.CREATE_WORKSPACE]: (meta) =>
    `Created workspace "${meta?.workspaceName ?? "Unknown"}"`,

  [activityAction.UPDATE_WORKSPACE]: (meta) =>
    `Updated workspace "${meta?.workspaceName ?? "Unknown"}"`,

  [activityAction.DELETE_WORKSPACE]: (meta) =>
    `Deleted workspace "${meta?.workspaceName ?? "Unknown"}"`,

  [activityAction.CREATE_LAYER]: (meta) =>
    `Created layer "${meta?.layerName ?? "Unknown"}"`,

  [activityAction.UPDATE_LAYER]: (meta) =>
    `Updated layer "${meta?.layerName ?? "Unknown"}"`,

  [activityAction.DELETE_LAYER]: (meta) =>
    `Deleted layer "${meta?.layerName ?? "Unknown"}`,
};
