import React, { useEffect, useRef } from "react";

export default function ComplexPlane({
  points = [],        // [{ re, im, color, label }]
  scale = 50,         // pixels par unité
  showGrid = true,
  showAxes = true,
  width = 700,
  height = 460,
  showTicks = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // grille
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = cx % scale; x < width; x += scale) {
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
      }
      for (let y = cy % scale; y < height; y += scale) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
      }
      ctx.stroke();
    }

    // axes
    if (showAxes) {
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // axe réel
      ctx.moveTo(0, cy); ctx.lineTo(width, cy);
      // axe imaginaire
      ctx.moveTo(cx, 0); ctx.lineTo(cx, height);
      ctx.stroke();

      // flèches
      const drawArrow = (x1,y1,x2,y2) => {
        const headlen = 8;
        const dx = x2-x1, dy = y2-y1;
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
        ctx.lineTo(x2 - headlen*Math.cos(angle - Math.PI/6), y2 - headlen*Math.sin(angle - Math.PI/6));
        ctx.moveTo(x2,y2);
        ctx.lineTo(x2 - headlen*Math.cos(angle + Math.PI/6), y2 - headlen*Math.sin(angle + Math.PI/6));
        ctx.stroke();
      };
      drawArrow(10, cy, width-10, cy);
      drawArrow(cx, height-10, cx, 10);

      // graduations
      if (showTicks) {
        ctx.fillStyle = "#6b7280";
        ctx.font = "12px sans-serif";
        for (let k = -Math.floor(cx/scale); k <= Math.floor(cx/scale); k++) {
          if (k === 0) continue;
          const x = cx + k*scale;
          ctx.beginPath();
          ctx.moveTo(x, cy-4); ctx.lineTo(x, cy+4);
          ctx.stroke();
          ctx.fillText(`${k}`, x-3, cy+16);
        }
        for (let k = -Math.floor(cy/scale); k <= Math.floor(cy/scale); k++) {
          if (k === 0) continue;
          const y = cy - k*scale;
          ctx.beginPath();
          ctx.moveTo(cx-4, y); ctx.lineTo(cx+4, y);
          ctx.stroke();
          ctx.fillText(`${k}i`, cx+6, y+4);
        }
      }
    }

    // points + segments origine
    points.forEach((p) => {
      const x = cx + p.re * scale;
      const y = cy - p.im * scale;

      // segment origine
      ctx.strokeStyle = p.color || "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      // point
      ctx.fillStyle = p.color || "#ef4444";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI*2);
      ctx.fill();

      // label
      if (p.label) {
        ctx.fillStyle = "#111827";
        ctx.font = "13px sans-serif";
        ctx.fillText(p.label, x + 8, y - 8);
      }
    });
  }, [points, scale, showGrid, showAxes, showTicks, width, height]);

  return (
    <div className="w-full overflow-x-auto">
      <canvas ref={ref} width={width} height={height} className="rounded-2xl border shadow-sm"/>
      <div className="mt-2 text-sm text-gray-600">Axe réel (→), Axe imaginaire (↑)</div>
    </div>
  );
}
