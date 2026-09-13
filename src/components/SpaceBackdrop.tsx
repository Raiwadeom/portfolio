"use client";

import { useEffect, useRef } from "react";
import { motionOn } from "@/lib/motion";
import { warp } from "@/lib/warp";

/**
 * Deep-space backdrop for the hero.
 *
 * Nebula clouds and the planet limb are expensive gradient work, so they are
 * painted once into an offscreen buffer at resize and then just blitted with
 * a slow drift. Per frame we only move stars and the odd meteor — a few
 * hundred 1px rects, which costs nothing.
 *
 * It sits OUTSIDE the zooming room layer, so the CRT can scale over the top
 * without this being re-rasterised every frame.
 */

type Star = { x: number; y: number; r: number; a: number; tw: number; depth: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };

export default function SpaceBackdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const host = wrap.current;
    if (!cv || !host) return;

    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = !motionOn();

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let inView = true;
    let docVisible = true;
    /* Forces a single repaint even while paused. Resizing clears the canvas
       (setting width/height wipes it), so without this a resize that lands
       while the tab is hidden leaves a black rectangle behind for good. */
    let dirty = true;
    let last = performance.now();
    let t = 0;

    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let nextMeteor = 3;

    const deep = document.createElement("canvas");
    const dctx = deep.getContext("2d");

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    /* ── the slow layer: nebula + planet, painted once ── */
    const paintDeep = () => {
      if (!dctx) return;
      const w = deep.width;
      const h = deep.height;

      const bg = dctx.createLinearGradient(0, 0, w * 0.3, h);
      bg.addColorStop(0, "#03050e");
      bg.addColorStop(0.5, "#040817");
      bg.addColorStop(1, "#02040c");
      dctx.fillStyle = bg;
      dctx.fillRect(0, 0, w, h);

      // nebula clouds
      const clouds: [number, number, number, string][] = [
        [0.22, 0.3, 0.52, "rgba(46,92,210,0.30)"],
        [0.74, 0.24, 0.46, "rgba(96,58,190,0.26)"],
        [0.52, 0.72, 0.58, "rgba(28,86,168,0.22)"],
        [0.1, 0.78, 0.4, "rgba(24,130,170,0.16)"],
        [0.88, 0.66, 0.38, "rgba(150,70,180,0.14)"],
      ];
      dctx.globalCompositeOperation = "lighter";
      for (const [cx, cy, cr, col] of clouds) {
        const g = dctx.createRadialGradient(
          cx * w,
          cy * h,
          0,
          cx * w,
          cy * h,
          cr * Math.max(w, h)
        );
        g.addColorStop(0, col);
        g.addColorStop(0.45, col.replace(/[\d.]+\)$/, "0.06)"));
        g.addColorStop(1, "rgba(0,0,0,0)");
        dctx.fillStyle = g;
        dctx.fillRect(0, 0, w, h);
      }

      // a faint band of distant stars, like a galactic plane
      dctx.save();
      dctx.translate(w * 0.5, h * 0.52);
      dctx.rotate(-0.38);
      const band = dctx.createLinearGradient(0, -h * 0.16, 0, h * 0.16);
      band.addColorStop(0, "rgba(0,0,0,0)");
      band.addColorStop(0.5, "rgba(140,175,240,0.10)");
      band.addColorStop(1, "rgba(0,0,0,0)");
      dctx.fillStyle = band;
      dctx.fillRect(-w, -h * 0.16, w * 2, h * 0.32);
      for (let i = 0; i < 700; i++) {
        const bx = rand(-w, w);
        const by = (Math.random() + Math.random() + Math.random() - 1.5) * h * 0.1;
        dctx.fillStyle = `rgba(200,220,255,${rand(0.05, 0.3)})`;
        dctx.fillRect(bx, by, 1, 1);
      }
      dctx.restore();
      dctx.globalCompositeOperation = "source-over";

      /* planet limb, lower-left, mostly off-frame */
      const pr = Math.max(w, h) * 0.62;
      const px = -w * 0.18;
      const py = h * 1.16;

      const body = dctx.createRadialGradient(
        px + pr * 0.42,
        py - pr * 0.5,
        pr * 0.05,
        px,
        py,
        pr
      );
      body.addColorStop(0, "#2d4f86");
      body.addColorStop(0.35, "#16305c");
      body.addColorStop(0.72, "#0a1730");
      body.addColorStop(1, "#04091a");
      dctx.fillStyle = body;
      dctx.beginPath();
      dctx.arc(px, py, pr, 0, Math.PI * 2);
      dctx.fill();

      // cloud banding
      dctx.save();
      dctx.beginPath();
      dctx.arc(px, py, pr, 0, Math.PI * 2);
      dctx.clip();
      for (let i = 0; i < 16; i++) {
        const by = py - pr + (i / 16) * pr * 2;
        dctx.fillStyle = `rgba(150,190,255,${rand(0.012, 0.05)})`;
        dctx.fillRect(px - pr, by, pr * 2, rand(4, 22));
      }
      dctx.restore();

      // atmosphere rim catching the light
      dctx.save();
      dctx.globalCompositeOperation = "lighter";
      const rim = dctx.createRadialGradient(px, py, pr * 0.955, px, py, pr * 1.06);
      rim.addColorStop(0, "rgba(90,170,255,0)");
      rim.addColorStop(0.45, "rgba(120,195,255,0.5)");
      rim.addColorStop(1, "rgba(70,140,255,0)");
      dctx.fillStyle = rim;
      dctx.beginPath();
      dctx.arc(px, py, pr * 1.06, 0, Math.PI * 2);
      dctx.fill();
      dctx.restore();
    };

    const seedStars = () => {
      const count = W < 700 ? 220 : 460;
      stars = [];
      for (let i = 0; i < count; i++) {
        const depth = Math.random();
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: depth > 0.93 ? rand(1.4, 2.1) : depth > 0.6 ? rand(0.8, 1.3) : rand(0.5, 0.9),
          a: rand(0.22, 0.95),
          tw: rand(0, Math.PI * 2),
          depth: 0.25 + depth * 0.75,
        });
      }
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // a little larger than the viewport so the drift never exposes an edge
      deep.width = Math.round(W * 1.06);
      deep.height = Math.round(H * 1.06);
      paintDeep();
      seedStars();
      dirty = true;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!inView || !docVisible) {
        last = now;
        // still owe the canvas one paint (fresh mount, or a resize wiped it)
        if (!dirty) return;
      }
      dirty = false;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) t += dt;

      // slow parallax drift of the whole field
      const dx = Math.sin(t * 0.045) * W * 0.014;
      const dy = Math.cos(t * 0.033) * H * 0.012;

      ctx.fillStyle = "#03050e";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(deep, -W * 0.03 + dx, -H * 0.03 + dy, deep.width, deep.height);

      /* warp: 0 is a still field, 1 is light speed. Stars accelerate away
         from the centre and stretch into streaks along the same vector. */
      const w = reduced ? 0 : warp.value;
      const cx = W * 0.5;
      const cy = H * 0.5;

      ctx.lineCap = "round";
      for (const s of stars) {
        if (!reduced) {
          if (w > 0.002) {
            /* Radial acceleration away from the centre.
               Growth is exponential, so the rate is the per-second constant
               folded through dt — NOT a per-frame multiplier. At w = 1 a star
               takes roughly a second to travel from the centre to the edge,
               which is what makes the streaks read as motion instead of
               flicker. (An earlier constant here was ~14x too fast: stars
               crossed the screen in about three frames and respawned
               constantly, which looked like noise.) */
            const ox = s.x - cx;
            const oy = s.y - cy;
            const k = 1 + w * 3.6 * dt;
            s.x = cx + ox * k;
            s.y = cy + oy * k;
            if (s.x < -60 || s.x > W + 60 || s.y < -60 || s.y > H + 60) {
              // re-enter through a ring, not a point, so there is no hot clump
              const ang = Math.random() * Math.PI * 2;
              const rad = (0.04 + Math.random() * 0.2) * Math.min(W, H);
              s.x = cx + Math.cos(ang) * rad;
              s.y = cy + Math.sin(ang) * rad;
            }
          } else {
            s.x -= 2.4 * s.depth * dt;
            if (s.x < -2) {
              s.x = W + 2;
              s.y = Math.random() * H;
            }
          }
        }

        const tw = reduced || w > 0.05 ? 1 : 0.72 + 0.28 * Math.sin(t * 1.7 + s.tw);
        const a = s.a * tw;
        const x = s.x + dx * s.depth * 1.6;
        const y = s.y + dy * s.depth * 1.6;

        if (w > 0.02) {
          const ox = x - cx;
          const oy = y - cy;
          const stretch = w * w * 0.55 * (0.35 + s.depth);
          ctx.strokeStyle = `rgba(214,232,255,${Math.min(1, a + w * 0.25)})`;
          ctx.lineWidth = s.r;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + ox * stretch, y + oy * stretch);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(214,232,255,${a})`;
          ctx.fillRect(x, y, s.r, s.r);

          // brightest few get a soft bloom
          if (s.r > 1.35) {
            ctx.fillStyle = `rgba(150,200,255,${a * 0.16})`;
            ctx.fillRect(x - 2, y - 2, s.r + 4, s.r + 4);
          }
        }
      }

      /* meteors */
      if (!reduced && warp.value < 0.05) {
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          nextMeteor = rand(3.5, 9);
          const fromLeft = Math.random() > 0.4;
          const sp = rand(620, 1050);
          meteors.push({
            x: fromLeft ? rand(-0.1, 0.5) * W : rand(0.6, 1.1) * W,
            y: rand(-0.05, 0.42) * H,
            vx: (fromLeft ? 1 : -1) * sp,
            vy: sp * rand(0.32, 0.6),
            life: 0,
            max: rand(0.7, 1.25),
          });
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          if (m.life > m.max) {
            meteors.splice(i, 1);
            continue;
          }
          const k = 1 - m.life / m.max;
          const tail = 0.085;
          const g = ctx.createLinearGradient(
            m.x,
            m.y,
            m.x - m.vx * tail,
            m.y - m.vy * tail
          );
          g.addColorStop(0, `rgba(226,240,255,${0.85 * k})`);
          g.addColorStop(0.4, `rgba(140,195,255,${0.35 * k})`);
          g.addColorStop(1, "rgba(120,180,255,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
          ctx.stroke();
        }
      }

      if (!reduced && warp.value > 0.05) {
        const bloom = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.max(W, H) * 0.42
        );
        const bi = warp.value * 0.22;
        bloom.addColorStop(0, `rgba(150,205,255,${bi})`);
        bloom.addColorStop(0.5, `rgba(70,140,255,${bi * 0.35})`);
        bloom.addColorStop(1, "rgba(70,140,255,0)");
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, W, H);
      }

      // settle everything into the page's darkness at the edges
      const v = ctx.createRadialGradient(
        W * 0.5,
        H * 0.46,
        Math.min(W, H) * 0.26,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.8
      );
      v.addColorStop(0, "rgba(3,6,15,0)");
      v.addColorStop(1, "rgba(3,6,15,0.82)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) dirty = true;
      },
      { threshold: 0 }
    );
    io.observe(host);

    const onVis = () => {
      docVisible = !document.hidden;
      // Coming back from another tab must resume the loop, not just pause it.
      if (docVisible) {
        dirty = true;
        last = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden" aria-hidden>
      <canvas ref={canvas} className="block w-full h-full" />
    </div>
  );
}
