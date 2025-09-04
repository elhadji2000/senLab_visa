export function add(z1, z2) {
  return { re: z1.re + z2.re, im: z1.im + z2.im };
}
export function mul(z1, z2) {
  return {
    re: z1.re * z2.re - z1.im * z2.im,
    im: z1.re * z2.im + z1.im * z2.re,
  };
}
export function mod(z) {
  return Math.hypot(z.re, z.im);
}
export function arg(z) {
  return Math.atan2(z.im, z.re); // radians
}
