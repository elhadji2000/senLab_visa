import React from "react";
export function generateArithmetic(a1, d, n) {
  return Array.from({ length: n }, (_, i) => a1 + i * d);
}

export function computeArithmeticNth(a1, d, n) {
  return a1 + (n - 1) * d;
}

export function arithmeticSum(a1, d, n) {
  return (n / 2) * (2 * a1 + (n - 1) * d);
}

export function generateGeometric(a1, q, n) {
  return Array.from({ length: n }, (_, i) => a1 * Math.pow(q, i));
}

export function computeGeometricNth(a1, q, n) {
  return a1 * Math.pow(q, n - 1);
}

export function geometricSum(a1, q, n) {
  if (Math.abs(q - 1) < 1e-9) return a1 * n;
  return a1 * (1 - Math.pow(q, n)) / (1 - q);
}

export function generateFibonacci(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    if (i < 2) arr.push(1);
    else arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr;
}

export function formatNumber(x) {
  if (!isFinite(x)) return "∞";
  if (Math.abs(x) > 1e6) return x.toExponential(3);
  return Number.isInteger(x) ? String(x) : String(Number(x).toFixed(4));
}
