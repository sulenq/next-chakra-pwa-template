export const getBadgeText = (status: string, t: any) => {
  if (status === "granted_permanent") return t.perm_granted_permanent;
  if (status === "granted_temporary") return t.perm_granted_temporary;
  if (status === "denied_permanent") return t.perm_denied_permanent;
  if (status === "denied_temporary") return t.perm_denied_temporary;
  return "";
};
