'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

// "Perlin Noise" — made with the 21st.dev Shader Builder
// Adapted from Paper Shaders: https://shaders.paper.design/perlin-noise
// Licensed under Apache-2.0: https://github.com/paper-design/shaders
const FRAGMENT_SHADER = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * (1.0 + u_intensity * 6.0);
  float base = fbm(q + vec2(t * 0.08, -t * 0.05) + u_seed);
  float turbulence = fbm(q * 2.1 + base * (1.0 + u_paramA * 4.0));
  return palette(mix(base, turbulence, u_paramA));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const COLORS = new Float32Array([
  0.169, 0.169, 0.169, // #2B2B2B
  0.0, 0.0, 0.0, // #000000
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,
]);

const SHAPE = [1.3, 0.0, 0.4, 0.5] as const;
const SURFACE = [0.8, 0.78, -0.15, 1.0] as const;
const FINISH = [0.0, 0.55, 0.02, 0.02] as const;
const TRANSFORM = [8737.0, 0.0, 0.24, 0.0] as const;
const SPACE_OFFSET = [0.2, -0.2] as const;
const TIME_SCALE = 0.29;
const CURSOR_EFFECT = 0.0;
const CURSOR = [0.12, 0.32] as const;

interface PerlinNoiseShaderBackgroundProps {
  className?: string;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function PerlinNoiseShaderBackground({
  className,
}: PerlinNoiseShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, presence: 0 });

  useEffect(() => {
    const containerEl = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!containerEl || !canvasEl) return;

    const glContext = canvasEl.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });

    if (!glContext) return;

    const gl = glContext;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorsLocation = gl.getUniformLocation(program, 'u_colors[0]');
    const sceneLocation = gl.getUniformLocation(program, 'u_scene');
    const shapeLocation = gl.getUniformLocation(program, 'u_shape');
    const surfaceLocation = gl.getUniformLocation(program, 'u_surface');
    const finishLocation = gl.getUniformLocation(program, 'u_finish');
    const transformLocation = gl.getUniformLocation(program, 'u_transform');
    const spaceLocation = gl.getUniformLocation(program, 'u_space');
    const cursorLocation = gl.getUniformLocation(program, 'u_cursor');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(colorsLocation, COLORS);
    gl.uniform4f(shapeLocation, ...SHAPE);
    gl.uniform4f(surfaceLocation, ...SURFACE);
    gl.uniform4f(finishLocation, ...FINISH);
    gl.uniform4f(transformLocation, ...TRANSFORM);
    gl.uniform4f(spaceLocation, SPACE_OFFSET[0], SPACE_OFFSET[1], 0, 0);

    let animationFrame = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let elapsedTime = 0;
    let lastFrameTime = performance.now();
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function drawFrame(now: number) {
      const pointer = pointerRef.current;

      if (pointer.presence > 0 && !reducedMotion) {
        const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
        elapsedTime += delta * TIME_SCALE;
      }

      lastFrameTime = now;

      gl.uniform4f(sceneLocation, width, height, elapsedTime, 2.0);
      gl.uniform4f(
        spaceLocation,
        SPACE_OFFSET[0],
        SPACE_OFFSET[1],
        pointer.x,
        pointer.y,
      );
      gl.uniform4f(
        cursorLocation,
        pointer.presence,
        CURSOR_EFFECT,
        CURSOR[0],
        CURSOR[1],
      );

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function tick(now: number) {
      if (!running) return;

      drawFrame(now);

      if (pointerRef.current.presence > 0 && !reducedMotion) {
        animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      animationFrame = 0;
    }

    function startAnimationLoop() {
      if (reducedMotion || animationFrame || !running) return;

      lastFrameTime = performance.now();
      animationFrame = window.requestAnimationFrame(tick);
    }

    function stopAnimationLoop() {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }

    function renderStaticFrame() {
      drawFrame(performance.now());
    }

    function resize() {
      if (!containerRef.current || !canvasRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      gl.viewport(0, 0, width, height);
      renderStaticFrame();
    }

    function handlePointerMove(event: PointerEvent) {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        pointerRef.current = { x: 0, y: 0, presence: 0 };
        stopAnimationLoop();
        renderStaticFrame();
        return;
      }

      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointerRef.current = { x: nx, y: ny, presence: 1 };
      startAnimationLoop();
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        running = false;
        stopAnimationLoop();
        return;
      }

      running = true;

      if (pointerRef.current.presence > 0) {
        startAnimationLoop();
        return;
      }

      renderStaticFrame();
    }

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerEl);

    return () => {
      running = false;
      stopAnimationLoop();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none size-full min-w-0 max-w-full overflow-hidden',
        className,
      )}
    >
      <canvas ref={canvasRef} className="block size-full max-w-full" />
    </div>
  );
}
