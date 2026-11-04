/**
 * Renders the real logo image as a solid 3D object with raw WebGL2, with no 3D library.
 *
 * The logo only exists as a bitmap, so there is no outline to extrude. Instead a signed distance field is computed
 * from its alpha channel, and a fragment shader ray-marches that field extruded into a bevelled slab. That gives a
 * true silhouette, side walls and surface normals at every angle, while the front face keeps the image's exact colours.
 */

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uColor;
uniform sampler2D uSdf;
uniform vec2 uRes;
uniform vec2 uLogo;   // half size of the logo in world units (x is 1)
uniform float uFrac;  // share of the canvas width the logo fills when facing the camera
uniform float uLod;
uniform float uTime;
uniform mat3 uRot;    // object space to world space
out vec4 outColor;

const float DEPTH = 0.05;
const float BEVEL = 0.013;
const float CAMERA = 4.2;
const float MARGIN = 0.14;

// The "technologies" tagline is the bottom strip of the image. Its strokes are too fine to extrude like the
// wordmark without turning into blobs, so that strip stays almost flat.
float taglineAt(float v) { return smoothstep(0.80, 0.84, v); }

float map(vec3 p) {
  vec2 clamped = clamp(p.xy, -uLogo, uLogo);
  vec2 uv = clamped / uLogo * vec2(0.5, -0.5) + 0.5;
  float d = texture(uSdf, uv).r + length(p.xy - clamped);
  float depth = mix(DEPTH, 0.01, taglineAt(uv.y));
  vec2 w = vec2(d + BEVEL, abs(p.z) - depth + BEVEL);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - BEVEL;
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0016;
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

// A small procedural studio: bright ceiling, deep navy floor, an electric-blue band and one soft box.
vec3 studio(vec3 r) {
  vec3 c = mix(vec3(0.02, 0.07, 0.15), vec3(0.80, 0.92, 1.0), smoothstep(-0.25, 0.8, r.y));
  c += vec3(0.0, 0.55, 0.97) * exp(-pow((r.y + 0.08) * 5.0, 2.0)) * 0.9;
  c += vec3(1.0) * smoothstep(0.86, 0.98, dot(r, normalize(vec3(-0.45, 0.6, 0.66)))) * 1.1;
  return c;
}

vec3 shade(vec3 p, vec3 rd) {
  vec3 n = normalAt(p);
  vec2 uv = clamp(p.xy / uLogo * vec2(0.5, -0.5) + 0.5, 0.0, 1.0);
  vec4 tex = textureLod(uColor, uv, uLod);
  vec3 navy = vec3(0.016, 0.098, 0.169);
  vec3 ink = mix(navy, tex.rgb, smoothstep(0.1, 0.6, tex.a));

  float face = max(smoothstep(0.82, 0.98, abs(n.z)), taglineAt(uv.y));
  vec3 base = mix(ink * 0.5, ink, face);
  float metal = mix(0.82, 0.16, face);

  vec3 wn = uRot * n;
  vec3 wv = -(uRot * rd);
  vec3 r = reflect(-wv, wn);
  vec3 env = studio(r);
  vec3 light = normalize(vec3(-0.4, 0.7, 0.75));

  float diffuse = 0.62 + 0.38 * max(dot(wn, light), 0.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - max(dot(wn, wv), 0.0), 5.0);
  float spec = pow(max(dot(r, light), 0.0), 70.0);

  vec3 c = base * diffuse * (1.0 - metal * 0.55);
  c += env * (metal * 0.62 + fresnel * 0.5);
  c += vec3(0.85, 0.95, 1.0) * spec * 0.8;

  // A slow band of gloss crossing the face, so it stays alive while it faces the viewer.
  float sweep = fract(uTime * 0.09) * 4.6 - 2.3;
  c += vec3(0.75, 0.9, 1.0) * exp(-pow((p.x + p.y * 0.6 - sweep) * 5.5, 2.0)) * 0.3 * face;
  return c;
}

void main() {
  vec2 ndc = gl_FragCoord.xy / uRes * 2.0 - 1.0;
  float aspect = uRes.y / uRes.x;
  vec3 target = vec3(ndc.x / uFrac, ndc.y * aspect / uFrac, 0.0);
  vec3 eye = vec3(0.0, 0.0, CAMERA);

  // Everything is marched in the logo's own space.
  mat3 inv = transpose(uRot);
  vec3 ro = inv * eye;
  vec3 rd = inv * normalize(target - eye);

  // Skip every pixel whose ray misses the logo's bounding box: most of the canvas.
  vec3 box = vec3(uLogo + MARGIN, DEPTH + MARGIN);
  vec3 m = 1.0 / rd;
  vec3 k = abs(m) * box;
  vec3 n = m * ro;
  float tNear = max(max(-n.x - k.x, -n.y - k.y), -n.z - k.z);
  float tFar = min(min(-n.x + k.x, -n.y + k.y), -n.z + k.z);
  if (tNear > tFar || tFar < 0.0) { outColor = vec4(0.0); return; }

  float pixel = 2.0 / (uRes.x * uFrac) * 1.2;
  float t = max(tNear, 0.0);
  float closest = 1e3;
  float closestT = t;
  bool hit = false;
  for (int i = 0; i < 44; i++) {
    float d = map(ro + rd * t);
    if (d < closest) { closest = d; closestT = t; }
    if (d < 0.0007) { hit = true; break; }
    t += d * 0.88;
    if (t > tFar) break;
  }

  // Soft neon halo that hugs the silhouette at any angle, fading to nothing at the edge of the box.
  float halo = 0.34 * max(exp(-max(closest, 0.0) * 19.0) - exp(-MARGIN * 19.0), 0.0);
  vec4 glow = vec4(vec3(0.0, 0.55, 0.97) * halo, halo);

  if (hit) {
    outColor = vec4(shade(ro + rd * t, rd), 1.0);
  } else if (closest < pixel) {
    // Anti-aliased edge: shade the nearest point and blend it by how much of the pixel it covers.
    float cover = 1.0 - closest / pixel;
    outColor = vec4(shade(ro + rd * closestT, rd) * cover, cover) + glow * (1.0 - cover);
  } else {
    outColor = glow;
  }
}`;

/** Felzenszwalb distance transform: squared distance to the nearest set cell, in linear time. */
function distanceTransform(grid: Float64Array, width: number, height: number) {
  const size = Math.max(width, height);
  const f = new Float64Array(size);
  const d = new Float64Array(size);
  const v = new Int32Array(size);
  const z = new Float64Array(size + 1);
  const pass = (n: number) => {
    let k = 0;
    v[0] = 0;
    z[0] = -Infinity;
    z[1] = Infinity;
    for (let q = 1; q < n; q++) {
      let s: number;
      do {
        const r = v[k]!;
        s = (f[q]! + q * q - f[r]! - r * r) / (2 * q - 2 * r);
      } while (s <= z[k]! && --k >= 0);
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = Infinity;
    }
    k = 0;
    for (let q = 0; q < n; q++) {
      while (z[k + 1]! < q) k++;
      const r = v[k]!;
      d[q] = (q - r) * (q - r) + f[r]!;
    }
  };
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) f[y] = grid[y * width + x]!;
    pass(height);
    for (let y = 0; y < height; y++) grid[y * width + x] = d[y]!;
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) f[x] = grid[y * width + x]!;
    pass(width);
    for (let x = 0; x < width; x++) grid[y * width + x] = d[x]!;
  }
}

/** Signed distance in world units (negative inside the logo), lightly blurred so the bevels catch light smoothly. */
function buildSdf(alpha: Uint8ClampedArray, width: number, height: number, worldPerPixel: number) {
  const inside = new Float64Array(width * height);
  const outside = new Float64Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const solid = alpha[i * 4 + 3]! > 127;
    inside[i] = solid ? 0 : 1e12;
    outside[i] = solid ? 1e12 : 0;
  }
  distanceTransform(inside, width, height);
  distanceTransform(outside, width, height);

  const raw = new Float32Array(width * height);
  for (let i = 0; i < raw.length; i++) raw[i] = (Math.sqrt(inside[i]!) - Math.sqrt(outside[i]!)) * worldPerPixel;

  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const yy = Math.min(height - 1, Math.max(0, y + dy));
          const xx = Math.min(width - 1, Math.max(0, x + dx));
          sum += raw[yy * width + xx]!;
        }
      }
      out[y * width + x] = sum / 9;
    }
  }
  return out;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Shader failed to compile");
  return shader;
}

export type HeroLogoRenderer = {
  /** Sizes the drawing buffer; `scale` is the device pixel ratio times the current quality step. */
  resize: (cssWidth: number, cssHeight: number, scale: number) => void;
  /** `yaw` and `tilt` are in radians, `time` in seconds. */
  draw: (yaw: number, tilt: number, time: number) => void;
  dispose: () => void;
};

/** Throws when the context, shaders or image are unavailable, so the caller can keep the static logo. */
export async function createHeroLogoRenderer(canvas: HTMLCanvasElement, src: string, widthFraction: number): Promise<HeroLogoRenderer> {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "high-performance" });
  if (!gl) throw new Error("WebGL2 is unavailable");

  const image = new Image();
  image.src = src;
  await image.decode();

  const sdfWidth = 768;
  const sdfHeight = Math.round((sdfWidth * image.naturalHeight) / image.naturalWidth);
  const sampler = document.createElement("canvas");
  sampler.width = sdfWidth;
  sampler.height = sdfHeight;
  const context = sampler.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("2D canvas is unavailable");
  context.drawImage(image, 0, 0, sdfWidth, sdfHeight);
  const sdf = buildSdf(context.getImageData(0, 0, sdfWidth, sdfHeight).data, sdfWidth, sdfHeight, 2 / sdfWidth);

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "Shader failed to link");
  gl.useProgram(program);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const colorTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, colorTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const sdfTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, sdfTexture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, sdfWidth, sdfHeight, 0, gl.RED, gl.FLOAT, sdf);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(uniform("uColor"), 0);
  gl.uniform1i(uniform("uSdf"), 1);
  gl.uniform2f(uniform("uLogo"), 1, image.naturalHeight / image.naturalWidth);
  gl.uniform1f(uniform("uFrac"), widthFraction);
  const uRes = uniform("uRes");
  const uRot = uniform("uRot");
  const uTime = uniform("uTime");
  const uLod = uniform("uLod");

  return {
    resize(cssWidth, cssHeight, scale) {
      const width = Math.max(1, Math.round(cssWidth * scale));
      const height = Math.max(1, Math.round(cssHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      // Pick the mip level that matches the logo's size on screen, so the small tagline stays crisp and stable.
      gl.uniform1f(uLod, Math.max(0, Math.log2(image.naturalWidth / (width * widthFraction))));
    },
    draw(yaw, tilt, time) {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cx = Math.cos(tilt);
      const sx = Math.sin(tilt);
      // Column-major tilt * yaw.
      gl.uniformMatrix3fv(uRot, false, [cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy]);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteTexture(colorTexture);
      gl.deleteTexture(sdfTexture);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}
