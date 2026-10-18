"use client";

/**
 * Nitro fire and exhaust smoke, drawn live over the car.
 *
 * The canvas is bigger than the car's box so flames and smoke can leave it.
 * Coordinates are expressed in the car image's own pixels (1470 x 600) and
 * scaled to whatever size the car is on screen, so the exhaust stays put on a
 * phone and on a desktop alike.
 *
 * Every couple of seconds the engine "blasts": the flame jumps from a low
 * idle flicker to a long blue-white jet, with sparks and a thick puff of
 * smoke behind it. The loop pauses off screen and when the tab is hidden, and
 * does not start for visitors who turned motion off.
 */

import { useEffect, useRef } from "react";

/** Where the exhaust sits in the car image, and which way fire leaves it. */
const EXHAUST = { x: 505, y: 268 };
const IMG = { w: 1470, h: 590 };
/** Extra room around the car box, as a share of the box. */
const PAD = { left: 0.45, top: 0.7, right: 0.05, bottom: 0.2 };

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  grow: number;
  seed: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function NitroCanvas() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    const box = canvas?.parentElement;
    if (!canvas || !box) return;
    if (document.documentElement.getAttribute("data-motion") === "off") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let k = 1; // image px -> canvas px
    let ox = 0;
    let oy = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const bw = box.clientWidth;
      const bh = box.clientHeight;
      if (!bw || !bh) return;
      w = Math.round(bw * (1 + PAD.left + PAD.right) * dpr);
      h = Math.round(bh * (1 + PAD.top + PAD.bottom) * dpr);
      /* assigning the size clears the canvas, so only do it when it changed */
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      k = (bw / IMG.w) * dpr;
      ox = (bw * PAD.left + EXHAUST.x * (bw / IMG.w)) * dpr;
      oy = (bh * PAD.top + EXHAUST.y * (bh / IMG.h)) * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const flames: P[] = [];
    const smoke: P[] = [];
    const sparks: P[] = [];

    let power = 0.25; // current flame strength 0..1
    let target = 0.25;
    let nextBlast = 0.8;
    let blastEnd = 0;
    let t = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const emit = (dt: number) => {
      // idle flicker is small; a blast is a long jet
      const n = Math.round((3 + power * 22) * Math.min(dt * 60, 3));
      for (let i = 0; i < n; i++) {
        flames.push({
          x: rand(-4, 4) * k,
          y: rand(-5, 5) * k,
          vx: -rand(260, 520) * (0.5 + power * 1.9) * k,
          vy: rand(-26, 26) * k + 18 * k,
          age: 0,
          life: rand(0.14, 0.34) * (0.7 + power * 0.9),
          size: rand(9, 17) * (0.7 + power * 0.9) * k,
          grow: 0.6,
          seed: Math.random(),
        });
      }
      const sm = Math.round((0.6 + power * 2.2) * Math.min(dt * 60, 3));
      for (let i = 0; i < sm; i++) {
        smoke.push({
          x: rand(-6, 6) * k,
          y: rand(-6, 6) * k,
          vx: -rand(40, 130) * (0.6 + power) * k,
          vy: -rand(8, 60) * k,
          age: 0,
          life: rand(1.4, 2.8),
          size: rand(10, 22) * k,
          grow: rand(55, 95) * k,
          seed: Math.random(),
        });
      }
      if (power > 0.7 && Math.random() < 0.5) {
        for (let i = 0; i < 3; i++) {
          sparks.push({
            x: rand(-8, 8) * k,
            y: rand(-4, 4) * k,
            vx: -rand(300, 900) * k,
            vy: rand(-260, 120) * k,
            age: 0,
            life: rand(0.2, 0.55),
            size: rand(1.2, 2.6) * k,
            grow: 0,
            seed: Math.random(),
          });
        }
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      /* motion switched off while the page is open, or no size yet: wait */
      if (document.documentElement.getAttribute("data-motion") === "off" || !w || !h) {
        last = now;
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      // blast scheduler
      if (t >= nextBlast) {
        target = 1;
        blastEnd = t + rand(0.55, 0.95);
        nextBlast = blastEnd + rand(0.9, 1.8);
      }
      if (target === 1 && t > blastEnd) target = 0.22 + Math.random() * 0.1;
      power += (target - power) * Math.min(1, dt * (target > power ? 22 : 7));

      emit(dt);

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(ox, oy);

      // smoke: dark, soft, growing
      ctx.globalCompositeOperation = "source-over";
      for (let i = smoke.length - 1; i >= 0; i--) {
        const s = smoke[i];
        s.age += dt;
        if (s.age >= s.life) {
          smoke.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.985;
        s.vy -= 14 * k * dt;
        const u = s.age / s.life;
        const r = s.size + s.grow * u;
        const a = (1 - u) * (1 - u) * 0.34;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        g.addColorStop(0, `rgba(34,10,10,${a})`);
        g.addColorStop(1, "rgba(34,10,10,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // fire: additive, white-blue core to orange to red
      ctx.globalCompositeOperation = "lighter";
      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        f.age += dt;
        if (f.age >= f.life) {
          flames.splice(i, 1);
          continue;
        }
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.vx *= 0.96;
        const u = f.age / f.life;
        const r = f.size * (1 - u * 0.55);
        const a = (1 - u) * 0.9;
        let c0: string;
        let c1: string;
        if (u < 0.28 && f.seed > 0.35) {
          c0 = `rgba(210,235,255,${a})`;
          c1 = `rgba(70,140,255,0)`;
        } else if (u < 0.6) {
          c0 = `rgba(255,214,120,${a})`;
          c1 = `rgba(255,110,20,0)`;
        } else {
          c0 = `rgba(255,90,20,${a * 0.8})`;
          c1 = `rgba(200,20,0,0)`;
        }
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, c0);
        g.addColorStop(1, c1);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // the jet itself: a bright, narrow core that stretches with power
      const len = (40 + power * 230) * k;
      const jet = ctx.createLinearGradient(0, 0, -len, 0);
      jet.addColorStop(0, `rgba(255,255,255,${0.55 + power * 0.4})`);
      jet.addColorStop(0.25, `rgba(150,200,255,${0.45 * power + 0.1})`);
      jet.addColorStop(1, "rgba(80,120,255,0)");
      ctx.fillStyle = jet;
      ctx.beginPath();
      ctx.ellipse(-len / 2, 4 * k, len / 2, (5 + power * 7) * k, 0.07, 0, Math.PI * 2);
      ctx.fill();

      // flash at the pipe
      const fr = (26 + power * 120) * k;
      const fl = ctx.createRadialGradient(0, 0, 0, 0, 0, fr);
      fl.addColorStop(0, `rgba(255,235,200,${0.35 + power * 0.5})`);
      fl.addColorStop(1, "rgba(255,120,30,0)");
      ctx.fillStyle = fl;
      ctx.beginPath();
      ctx.arc(0, 0, fr, 0, Math.PI * 2);
      ctx.fill();

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 900 * k * dt;
        const a = 1 - s.age / s.life;
        ctx.strokeStyle = `rgba(255,220,140,${a})`;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 0.022, s.y - s.vy * 0.022);
        ctx.stroke();
      }

      ctx.restore();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    io.observe(box);
    const onVis = () => (document.hidden || !onScreen ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={cv}
      aria-hidden
      className="nitro-canvas"
      style={{
        left: `${-PAD.left * 100}%`,
        top: `${-PAD.top * 100}%`,
        width: `${(1 + PAD.left + PAD.right) * 100}%`,
        height: `${(1 + PAD.top + PAD.bottom) * 100}%`,
      }}
    />
  );
}
