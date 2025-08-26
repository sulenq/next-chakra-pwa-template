export const maskEmail = (email?: string) => {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "";
  }

  const [local, domain] = email.split("@");
  if (local.length <= 3) {
    return `${local}@${domain}`;
  }
  const visible = local.slice(0, 3);
  const stars = "*".repeat(local.length - 3);
  return `${visible}${stars}@${domain}`;
};
