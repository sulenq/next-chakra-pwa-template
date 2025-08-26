export const arrayType = (input: unknown): "array" | "object" | "other" => {
  if (Array.isArray(input)) {
    return "array";
  } else if (
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input)
  ) {
    return "object";
  } else {
    return "other";
  }
};
