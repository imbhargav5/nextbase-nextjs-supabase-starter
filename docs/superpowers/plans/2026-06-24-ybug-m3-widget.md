# Milestone 3 — Embeddable Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `packages/widget` — a self-contained Preact widget that boots from a `<script data-project-key>` tag, validates the key via `/api/widget-config`, captures a client-side screenshot, lets the visitor annotate it (pen / rectangle / arrow / blackout) and fill a form, then assembles the submission payload + flattened image blob. Serve the built bundle at `/widget.js`.

**Architecture:** Vite library-mode build (IIFE) using Preact for UI, mounted in a Shadow DOM for style isolation. Screenshot capture via `modern-screenshot`. Pure, unit-tested modules for metadata collection and payload assembly; the canvas annotator and UI are verified manually. A Vite `closeBundle` hook copies the bundle to `apps/web/public/widget.js`. The actual network submit wires to `/api/ingest` (built in M4).

**Tech Stack:** Vite, Preact, `modern-screenshot`, TypeScript, Vitest (jsdom).

**Prereq:** M2 complete (so `/api/widget-config` exists). **Read:** `2026-06-24-ybug-clone-overview.md`.

---

## File Structure

- Create: `packages/widget/package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`
- Create: `packages/widget/src/metadata.ts` (+ test) — collect page/browser/os/screen
- Create: `packages/widget/src/payload.ts` (+ test) — `buildIngestPayload()`
- Create: `packages/widget/src/capture.ts` — `captureScreenshot()`
- Create: `packages/widget/src/annotator.ts` — `Annotator` canvas class
- Create: `packages/widget/src/api.ts` — config/ingest/upload network calls
- Create: `packages/widget/src/styles.ts` — scoped CSS string
- Create: `packages/widget/src/ui.tsx` — Preact `WidgetApp`
- Create: `packages/widget/src/index.ts` — bootstrap + Shadow DOM mount
- Modify: `apps/web/.gitignore` or root `.gitignore` — ignore generated `apps/web/public/widget.js`
- Create: `apps/web/public/widget-test.html` — local harness for manual capture/annotate testing

> **Cross-plan contract:** the payload field names below (`projectKey`, `type`, `description`, `reporterName`, `reporterEmail`, `pageUrl`, `browser`, `os`, `screenSize`) MUST match the M4 `ingestPayloadSchema` exactly.

---

## Task 1: Scaffold the widget package

**Files:**

- Create: `packages/widget/package.json`, `packages/widget/tsconfig.json`, `packages/widget/vite.config.ts`, `packages/widget/vitest.config.ts`

- [ ] **Step 1: Create `package.json`**

Create `packages/widget/package.json`:

```json
{
  "name": "@nextbase/widget",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "modern-screenshot": "^4.5.0",
    "preact": "^10.24.0"
  },
  "devDependencies": {
    "@preact/preset-vite": "^2.9.0",
    "jsdom": "^29.1.1",
    "typescript": "^6.0.3",
    "vite": "^6.0.0",
    "vitest": "^4.1.6"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

Create `packages/widget/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2019", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `vite.config.ts` (IIFE build + copy to web public)**

Create `packages/widget/vite.config.ts`:

```ts
import preact from "@preact/preset-vite";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = dirname(fileURLToPath(import.meta.url));
const webPublic = resolve(here, "../../apps/web/public/widget.js");

export default defineConfig({
  plugins: [
    preact(),
    {
      name: "copy-widget-to-web-public",
      closeBundle() {
        mkdirSync(dirname(webPublic), { recursive: true });
        copyFileSync(resolve(here, "dist/widget.js"), webPublic);
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(here, "src/index.ts"),
      formats: ["iife"],
      name: "YbugWidget",
      fileName: () => "widget.js",
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
    emptyOutDir: true,
  },
});
```

- [ ] **Step 4: Create `vitest.config.ts`**

Create `packages/widget/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "jsdom", include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 5: Install deps + ignore the generated bundle**

Run from repo root: `pnpm install`

Add to root `.gitignore`:

```
apps/web/public/widget.js
```

- [ ] **Step 6: Commit**

```bash
git add packages/widget/package.json packages/widget/tsconfig.json packages/widget/vite.config.ts packages/widget/vitest.config.ts pnpm-lock.yaml .gitignore
git commit -m "chore(widget): scaffold preact widget package"
```

---

## Task 2: Metadata collection

**Files:**

- Create: `packages/widget/src/metadata.ts`
- Test: `packages/widget/src/metadata.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/widget/src/metadata.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { collectMetadataFrom } from "./metadata";

const CHROME_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

describe("collectMetadataFrom", () => {
  it("extracts the page url", () => {
    const m = collectMetadataFrom({
      href: "https://site.com/page?x=1",
      userAgent: CHROME_MAC,
      screenWidth: 1440,
      screenHeight: 900,
    });
    expect(m.pageUrl).toBe("https://site.com/page?x=1");
  });
  it("detects Chrome on macOS", () => {
    const m = collectMetadataFrom({
      href: "https://site.com",
      userAgent: CHROME_MAC,
      screenWidth: 1440,
      screenHeight: 900,
    });
    expect(m.browser).toBe("Chrome");
    expect(m.os).toBe("macOS");
  });
  it("formats screen size as WxH", () => {
    const m = collectMetadataFrom({
      href: "https://site.com",
      userAgent: CHROME_MAC,
      screenWidth: 1440,
      screenHeight: 900,
    });
    expect(m.screenSize).toBe("1440x900");
  });
  it("falls back to Unknown for unrecognised agents", () => {
    const m = collectMetadataFrom({
      href: "https://x",
      userAgent: "weird-bot/1.0",
      screenWidth: 0,
      screenHeight: 0,
    });
    expect(m.browser).toBe("Unknown");
    expect(m.os).toBe("Unknown");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/widget && pnpm vitest run src/metadata.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `packages/widget/src/metadata.ts`:

```ts
export interface MetadataInput {
  href: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}

export interface ReportMetadata {
  pageUrl: string;
  browser: string;
  os: string;
  screenSize: string;
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/chrome\//i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && /version\//i.test(ua)) return "Safari";
  return "Unknown";
}

function detectOs(ua: string): string {
  if (/windows nt/i.test(ua)) return "Windows";
  if (/mac os x/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
}

export function collectMetadataFrom(input: MetadataInput): ReportMetadata {
  return {
    pageUrl: input.href,
    browser: detectBrowser(input.userAgent),
    os: detectOs(input.userAgent),
    screenSize: `${input.screenWidth}x${input.screenHeight}`,
  };
}

export function collectMetadata(): ReportMetadata {
  return collectMetadataFrom({
    href: window.location.href,
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/widget && pnpm vitest run src/metadata.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/widget/src/metadata.ts packages/widget/src/metadata.test.ts
git commit -m "feat(widget): add metadata collection"
```

---

## Task 3: Payload builder

**Files:**

- Create: `packages/widget/src/payload.ts`
- Test: `packages/widget/src/payload.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/widget/src/payload.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildIngestPayload } from "./payload";

const metadata = {
  pageUrl: "https://site.com/p",
  browser: "Chrome",
  os: "macOS",
  screenSize: "1440x900",
};

describe("buildIngestPayload", () => {
  it("maps fields and flattens metadata", () => {
    const payload = buildIngestPayload({
      projectKey: "pk_x",
      type: "bug",
      description: "It broke",
      reporterName: "Ada",
      reporterEmail: "ada@x.com",
      metadata,
    });
    expect(payload).toEqual({
      projectKey: "pk_x",
      type: "bug",
      description: "It broke",
      reporterName: "Ada",
      reporterEmail: "ada@x.com",
      pageUrl: "https://site.com/p",
      browser: "Chrome",
      os: "macOS",
      screenSize: "1440x900",
    });
  });
  it("normalises blank reporter fields to null", () => {
    const payload = buildIngestPayload({
      projectKey: "pk_x",
      type: "idea",
      description: "Nice",
      reporterName: "   ",
      reporterEmail: "",
      metadata,
    });
    expect(payload.reporterName).toBeNull();
    expect(payload.reporterEmail).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/widget && pnpm vitest run src/payload.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `packages/widget/src/payload.ts`:

```ts
import type { ReportMetadata } from "./metadata";

export type FeedbackType = "bug" | "idea" | "question";

export interface BuildPayloadInput {
  projectKey: string;
  type: FeedbackType;
  description: string;
  reporterName?: string;
  reporterEmail?: string;
  metadata: ReportMetadata;
}

export interface IngestPayload {
  projectKey: string;
  type: FeedbackType;
  description: string;
  reporterName: string | null;
  reporterEmail: string | null;
  pageUrl: string;
  browser: string;
  os: string;
  screenSize: string;
}

function nullifyBlank(value: string | undefined): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function buildIngestPayload(input: BuildPayloadInput): IngestPayload {
  return {
    projectKey: input.projectKey,
    type: input.type,
    description: input.description.trim(),
    reporterName: nullifyBlank(input.reporterName),
    reporterEmail: nullifyBlank(input.reporterEmail),
    pageUrl: input.metadata.pageUrl,
    browser: input.metadata.browser,
    os: input.metadata.os,
    screenSize: input.metadata.screenSize,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/widget && pnpm vitest run src/payload.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/widget/src/payload.ts packages/widget/src/payload.test.ts
git commit -m "feat(widget): add ingest payload builder"
```

---

## Task 4: Screenshot capture

**Files:**

- Create: `packages/widget/src/capture.ts`

- [ ] **Step 1: Implement (no unit test — DOM rasterization is verified manually in Task 8)**

Create `packages/widget/src/capture.ts`:

```ts
import { domToBlob } from "modern-screenshot";

/**
 * Rasterizes the current page into a PNG blob. Cross-origin images that would
 * taint the canvas are skipped by modern-screenshot's fetch fallback; any hard
 * failure rejects so the caller can degrade gracefully.
 */
export async function captureScreenshot(
  target: HTMLElement = document.body
): Promise<Blob> {
  return domToBlob(target, {
    type: "image/png",
    backgroundColor: "#ffffff",
    scale: Math.min(window.devicePixelRatio || 1, 2),
  });
}
```

- [ ] **Step 2: Typecheck**

Run: `cd packages/widget && pnpm tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add packages/widget/src/capture.ts
git commit -m "feat(widget): add client-side screenshot capture"
```

---

## Task 5: Canvas annotator

**Files:**

- Create: `packages/widget/src/annotator.ts`

- [ ] **Step 1: Implement the annotator class**

Create `packages/widget/src/annotator.ts`:

```ts
export type Tool = "pen" | "rect" | "arrow" | "blackout";

interface Point {
  x: number;
  y: number;
}

interface Shape {
  tool: Tool;
  color: string;
  points: Point[];
}

/**
 * Renders a base screenshot onto a canvas and lets the user draw annotations.
 * Blackout shapes are filled opaque so flattening permanently redacts pixels.
 */
export class Annotator {
  private ctx: CanvasRenderingContext2D;
  private baseImage: HTMLImageElement | null = null;
  private shapes: Shape[] = [];
  private current: Shape | null = null;
  private drawing = false;

  tool: Tool = "pen";
  color = "#ff3b30";

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context unavailable");
    this.ctx = ctx;
    canvas.addEventListener("pointerdown", this.onDown);
    canvas.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
  }

  async loadImage(blob: Blob): Promise<void> {
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });
      this.baseImage = img;
      this.canvas.width = img.naturalWidth;
      this.canvas.height = img.naturalHeight;
      this.redraw();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  undo(): void {
    this.shapes.pop();
    this.redraw();
  }

  private toCanvasPoint(e: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * this.canvas.height,
    };
  }

  private onDown = (e: PointerEvent) => {
    this.drawing = true;
    this.current = {
      tool: this.tool,
      color: this.color,
      points: [this.toCanvasPoint(e)],
    };
  };

  private onMove = (e: PointerEvent) => {
    if (!this.drawing || !this.current) return;
    const point = this.toCanvasPoint(e);
    if (this.current.tool === "pen") {
      this.current.points.push(point);
    } else {
      this.current.points[1] = point;
    }
    this.redraw();
  };

  private onUp = () => {
    if (this.current) {
      this.shapes.push(this.current);
      this.current = null;
    }
    this.drawing = false;
    this.redraw();
  };

  private redraw(): void {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.baseImage) ctx.drawImage(this.baseImage, 0, 0);
    const all = this.current ? [...this.shapes, this.current] : this.shapes;
    for (const shape of all) this.drawShape(shape);
  }

  private drawShape(shape: Shape): void {
    const { ctx } = this;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = shape.color;
    const [a, b] = shape.points;
    if (shape.tool === "pen") {
      ctx.beginPath();
      shape.points.forEach((p, i) =>
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
      );
      ctx.stroke();
    } else if (shape.tool === "rect" && b) {
      ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
    } else if (shape.tool === "blackout" && b) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(
        Math.min(a.x, b.x),
        Math.min(a.y, b.y),
        Math.abs(b.x - a.x),
        Math.abs(b.y - a.y)
      );
    } else if (shape.tool === "arrow" && b) {
      this.drawArrow(a, b, shape.color);
    }
  }

  private drawArrow(from: Point, to: Point, color: string): void {
    const { ctx } = this;
    const head = 16;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - head * Math.cos(angle - Math.PI / 6),
      to.y - head * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      to.x - head * Math.cos(angle + Math.PI / 6),
      to.y - head * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  /** Flattens base image + annotations into a single blob. */
  async toBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/png"
      );
    });
  }

  destroy(): void {
    this.canvas.removeEventListener("pointerdown", this.onDown);
    this.canvas.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
  }
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `cd packages/widget && pnpm tsc --noEmit` → clean.

```bash
git add packages/widget/src/annotator.ts
git commit -m "feat(widget): add canvas annotator with pen/rect/arrow/blackout"
```

---

## Task 6: API client

**Files:**

- Create: `packages/widget/src/api.ts`

- [ ] **Step 1: Implement (network module; integration-verified in M4)**

Create `packages/widget/src/api.ts`:

```ts
import type { IngestPayload } from "./payload";

export interface WidgetConfig {
  active: boolean;
  theme?: { buttonColor: string; position: "bottom-right" | "bottom-left" };
}

export interface IngestResponse {
  reportId: string;
  uploadUrl: string;
}

export async function fetchWidgetConfig(
  origin: string,
  key: string
): Promise<WidgetConfig> {
  const res = await fetch(
    `${origin}/api/widget-config?key=${encodeURIComponent(key)}`
  );
  if (!res.ok) return { active: false };
  return (await res.json()) as WidgetConfig;
}

export async function submitReport(
  origin: string,
  payload: IngestPayload
): Promise<IngestResponse> {
  const res = await fetch(`${origin}/api/ingest`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Ingest failed (${res.status})`);
  }
  return (await res.json()) as IngestResponse;
}

export async function uploadScreenshot(
  uploadUrl: string,
  blob: Blob
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "content-type": blob.type || "image/png" },
    body: blob,
  });
  if (!res.ok) {
    throw new Error(`Screenshot upload failed (${res.status})`);
  }
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `cd packages/widget && pnpm tsc --noEmit` → clean.

```bash
git add packages/widget/src/api.ts
git commit -m "feat(widget): add api client for config/ingest/upload"
```

---

## Task 7: Styles, UI, and bootstrap

**Files:**

- Create: `packages/widget/src/styles.ts`, `packages/widget/src/ui.tsx`, `packages/widget/src/index.ts`

- [ ] **Step 1: Scoped styles**

Create `packages/widget/src/styles.ts`:

```ts
export const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, sans-serif; }
.launcher {
  position: fixed; bottom: 20px; right: 20px; z-index: 2147483000;
  background: #5b6cff; color: #fff; border: none; border-radius: 999px;
  padding: 12px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,.25);
}
.overlay {
  position: fixed; inset: 0; z-index: 2147483001; background: rgba(0,0,0,.6);
  display: flex; align-items: center; justify-content: center;
}
.panel {
  background: #fff; border-radius: 12px; width: min(900px, 94vw);
  max-height: 92vh; overflow: auto; padding: 16px;
}
.toolbar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.toolbar button { padding: 6px 10px; border-radius: 8px; border: 1px solid #ddd; background: #fff; cursor: pointer; }
.toolbar button.active { background: #5b6cff; color: #fff; border-color: #5b6cff; }
.canvas-wrap { border: 1px solid #eee; overflow: auto; max-height: 50vh; }
canvas { max-width: 100%; display: block; cursor: crosshair; }
.field { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
.field label { font-size: 12px; color: #444; }
.field input, .field textarea, .field select { padding: 8px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; }
.row { display: flex; gap: 8px; }
.row > * { flex: 1; }
.actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.actions .primary { background: #5b6cff; color: #fff; border: none; }
.actions button { padding: 9px 14px; border-radius: 8px; border: 1px solid #ccc; cursor: pointer; }
.msg { padding: 12px; text-align: center; }
.error { color: #b00020; }
`;
```

- [ ] **Step 2: Preact UI**

Create `packages/widget/src/ui.tsx`:

```tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { submitReport, uploadScreenshot } from "./api";
import { Annotator, type Tool } from "./annotator";
import { captureScreenshot } from "./capture";
import { collectMetadata } from "./metadata";
import { buildIngestPayload, type FeedbackType } from "./payload";

type Step = "idle" | "capturing" | "editing" | "sending" | "done" | "error";

export function WidgetApp({
  origin,
  projectKey,
}: {
  origin: string;
  projectKey: string;
}) {
  const [step, setStep] = useState<Step>("idle");
  const [tool, setTool] = useState<Tool>("pen");
  const [type, setType] = useState<FeedbackType>("bug");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annotatorRef = useRef<Annotator | null>(null);

  const open = async () => {
    setStep("capturing");
    try {
      const blob = await captureScreenshot();
      setStep("editing");
      requestAnimationFrame(async () => {
        if (!canvasRef.current) return;
        const annotator = new Annotator(canvasRef.current);
        annotatorRef.current = annotator;
        await annotator.loadImage(blob);
      });
    } catch {
      setErrorMsg("Could not capture this page. Please try again.");
      setStep("error");
    }
  };

  useEffect(() => {
    if (annotatorRef.current) annotatorRef.current.tool = tool;
  }, [tool]);

  const close = () => {
    annotatorRef.current?.destroy();
    annotatorRef.current = null;
    setStep("idle");
    setDescription("");
  };

  const send = async () => {
    setStep("sending");
    try {
      const payload = buildIngestPayload({
        projectKey,
        type,
        description,
        reporterName: name,
        reporterEmail: email,
        metadata: collectMetadata(),
      });
      const { uploadUrl } = await submitReport(origin, payload);
      const flattened = await annotatorRef.current!.toBlob();
      await uploadScreenshot(uploadUrl, flattened);
      setStep("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Submission failed");
      setStep("error");
    }
  };

  if (step === "idle") {
    return (
      <button class="launcher" onClick={open}>
        Feedback
      </button>
    );
  }

  return (
    <div class="overlay">
      <div class="panel">
        {step === "capturing" && <div class="msg">Capturing screenshot…</div>}
        {step === "sending" && <div class="msg">Sending…</div>}
        {step === "done" && (
          <div class="msg">
            Thanks for your feedback!
            <div class="actions">
              <button class="primary" onClick={close}>
                Close
              </button>
            </div>
          </div>
        )}
        {step === "error" && (
          <div class="msg error">
            {errorMsg}
            <div class="actions">
              <button onClick={close}>Close</button>
            </div>
          </div>
        )}
        {step === "editing" && (
          <div>
            <div class="toolbar">
              {(["pen", "rect", "arrow", "blackout"] as Tool[]).map((t) => (
                <button
                  class={tool === t ? "active" : ""}
                  onClick={() => setTool(t)}
                >
                  {t}
                </button>
              ))}
              <button onClick={() => annotatorRef.current?.undo()}>undo</button>
            </div>
            <div class="canvas-wrap">
              <canvas ref={canvasRef} />
            </div>
            <div class="row">
              <div class="field">
                <label>Type</label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      (e.target as HTMLSelectElement).value as FeedbackType
                    )
                  }
                >
                  <option value="bug">Bug</option>
                  <option value="idea">Idea</option>
                  <option value="question">Question</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Description</label>
              <textarea
                rows={3}
                value={description}
                onInput={(e) =>
                  setDescription((e.target as HTMLTextAreaElement).value)
                }
              />
            </div>
            <div class="row">
              <div class="field">
                <label>Your name (optional)</label>
                <input
                  value={name}
                  onInput={(e) => setName((e.target as HTMLInputElement).value)}
                />
              </div>
              <div class="field">
                <label>Your email (optional)</label>
                <input
                  value={email}
                  onInput={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                />
              </div>
            </div>
            <div class="actions">
              <button onClick={close}>Cancel</button>
              <button
                class="primary"
                disabled={description.trim().length === 0}
                onClick={send}
              >
                Send feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Bootstrap + Shadow DOM mount**

Create `packages/widget/src/index.ts`:

```ts
import { render } from "preact";
import { h } from "preact";
import { fetchWidgetConfig } from "./api";
import { STYLES } from "./styles";
import { WidgetApp } from "./ui";

function getCurrentScript(): HTMLScriptElement | null {
  if (document.currentScript instanceof HTMLScriptElement) {
    return document.currentScript;
  }
  return document.querySelector<HTMLScriptElement>("script[data-project-key]");
}

async function boot() {
  try {
    const script = getCurrentScript();
    const projectKey = script?.getAttribute("data-project-key");
    if (!projectKey) return;

    const origin = new URL(script!.src).origin;
    const config = await fetchWidgetConfig(origin, projectKey);
    if (!config.active) return;

    const host = document.createElement("div");
    host.id = "ybug-widget-root";
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = STYLES;
    shadow.appendChild(style);
    const mount = document.createElement("div");
    shadow.appendChild(mount);

    render(h(WidgetApp, { origin, projectKey }), mount);
  } catch {
    // Never break the host page.
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
```

- [ ] **Step 4: Build**

Run: `cd packages/widget && pnpm build`
Expected: `packages/widget/dist/widget.js` created AND copied to `apps/web/public/widget.js`.

- [ ] **Step 5: Typecheck + commit**

Run: `cd packages/widget && pnpm tsc --noEmit` → clean.

```bash
git add packages/widget/src/styles.ts packages/widget/src/ui.tsx packages/widget/src/index.ts
git commit -m "feat(widget): add shadow-dom UI and bootstrap"
```

---

## Task 8: Local test harness + manual verification

**Files:**

- Create: `apps/web/public/widget-test.html`

- [ ] **Step 1: Create a harness page**

Create `apps/web/public/widget-test.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Widget harness</title>
  </head>
  <body>
    <h1>Widget test page</h1>
    <p>This page hosts the widget for manual capture/annotate testing.</p>
    <img src="https://picsum.photos/600/300" alt="sample" />
    <!-- Replace PROJECT_KEY with a real project's public_key (add "localhost" to its allowed domains). -->
    <script async src="/widget.js" data-project-key="PROJECT_KEY"></script>
  </body>
</html>
```

- [ ] **Step 2: Manual verification**

1. Ensure the widget bundle is built and copied: `cd packages/widget && pnpm build`.
2. Create a project in the dashboard; add `localhost` to its allowed domains; copy its `public_key` into `widget-test.html`.
3. Run `pnpm web#dev`, open `http://localhost:3000/widget-test.html`.
4. Confirm: the **Feedback** launcher appears (bottom-right), clicking it captures a screenshot, the annotate tools draw correctly, blackout redacts, and the form renders inside the Shadow DOM (host page styles do not bleed in).
5. Clicking **Send feedback** will fail at the network step with a 404/❌ until M4 builds `/api/ingest` — this is expected. Capture + annotate + form must work now.

- [ ] **Step 3: Commit**

```bash
git add apps/web/public/widget-test.html
git commit -m "test(widget): add local widget harness page"
```

---

## Self-check (end of milestone)

- [ ] `cd packages/widget && pnpm test` → metadata + payload tests pass.
- [ ] `cd packages/widget && pnpm build` → emits `dist/widget.js` and copies to `apps/web/public/widget.js`.
- [ ] `pnpm typecheck` → clean across the monorepo.
- [ ] Manual: launcher → capture → annotate (all 4 tools + undo) → form renders in Shadow DOM. (Submit completes in M4.)
