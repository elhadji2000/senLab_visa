export function scaleQuantity(quantity, baseServings, targetServings, rounding = "none") {
  const factor = targetServings / baseServings;
  const exact = quantity * factor;
  switch (rounding) {
    case "integer":
      return Math.round(exact);
    case "half":
      return Math.round(exact * 2) / 2;
    default:
      return exact;
  }
}

export function formatNumber(n) {
  return (Math.round(n * 100) / 100).toString().replace(".", ",");
}
