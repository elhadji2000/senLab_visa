export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (a, k) => ({ x: a.x * k, y: a.y * k });
export const dot = (a, b) => a.x * b.x + a.y * b.y;
export const mag = (a) => Math.hypot(a.x, a.y);
export const mag2 = (a) => a.x * a.x + a.y * a.y;

export function angle(a, b) {
  const ma = mag(a), mb = mag(b);
  if (ma === 0 || mb === 0) return null;
  const cos = dot(a, b) / (ma * mb);
  const clamped = Math.max(-1, Math.min(1, cos));
  return Math.acos(clamped); // radians
}

export function projectionOfAOntoB(a, b) {
  const b2 = mag2(b);
  if (b2 === 0) return { x: 0, y: 0 };
  const k = dot(a, b) / b2;
  return scale(b, k);
}

export const toDeg = (rad) => (rad == null ? null : (rad * 180) / Math.PI);

export const nearZero = (x, eps = 1e-6) => Math.abs(x) < eps;
