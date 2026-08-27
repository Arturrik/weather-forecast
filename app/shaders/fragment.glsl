precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uWeatherType;
uniform float uTransition;
uniform float uFlashIntensity;
uniform float uReducedMotion;
uniform float uScrollDepth;
uniform float uQuality;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p, float quality) {
  float value = 0.5 * snoise(p);
  value += 0.25 * snoise(p * 2.0);
  if (quality > 0.5) {
    value += 0.125 * snoise(p * 4.0);
  }
  return value;
}

vec3 weatherColor(float type) {
  if (type < 0.5) return mix(vec3(0.04, 0.06, 0.1), vec3(0.1, 0.12, 0.18), 0.5);
  if (type < 1.5) return vec3(0.96, 0.62, 0.04);
  if (type < 2.5) return vec3(0.12, 0.25, 0.55);
  if (type < 3.5) return vec3(0.85, 0.9, 0.95);
  if (type < 4.5) return vec3(0.15, 0.1, 0.25);
  if (type < 5.5) return vec3(0.35, 0.4, 0.45);
  return vec3(0.3, 0.35, 0.42);
}

vec3 weatherColor2(float type) {
  if (type < 0.5) return vec3(0.1, 0.12, 0.18);
  if (type < 1.5) return vec3(0.94, 0.27, 0.27);
  if (type < 2.5) return vec3(0.12, 0.25, 0.69);
  if (type < 3.5) return vec3(0.58, 0.64, 0.72);
  if (type < 4.5) return vec3(0.3, 0.11, 0.58);
  if (type < 5.5) return vec3(0.2, 0.25, 0.33);
  return vec3(0.28, 0.33, 0.4);
}

void main() {
  vec2 uv = vUv;
  vec2 parallax = (uMouse - 0.5) * 0.05 * (1.0 - uReducedMotion);
  float depth = 1.0 + uScrollDepth * 0.1;
  vec3 coord = vec3((uv + parallax) * depth * 1.8, uTime * 0.025);

  float clouds = fbm(coord + vec3(uTime * 0.015, 0.0, 0.0), uQuality);
  clouds = smoothstep(-0.15, 0.75, clouds);

  vec3 c1 = weatherColor(uWeatherType);
  vec3 c2 = weatherColor2(uWeatherType);
  vec3 sky = mix(c1, c2, uv.y + clouds * 0.25);

  vec3 neutralTop = vec3(0.043, 0.059, 0.098);
  vec3 neutralBottom = vec3(0.102, 0.122, 0.18);
  vec3 neutralSky = mix(neutralBottom, neutralTop, uv.y);
  sky = mix(neutralSky, sky, uTransition);

  if (uQuality > 0.5 && uWeatherType > 0.5 && uWeatherType < 1.5 && uReducedMotion < 0.5) {
    vec2 sunPos = vec2(0.75 + parallax.x, 0.82 + parallax.y);
    vec2 toSun = uv - sunPos;
    float dist = length(toSun);
    float glow = exp(-dist * 3.0) * 0.5;
    sky += vec3(1.0, 0.7, 0.2) * glow;
  }

  if (uWeatherType > 3.5 && uWeatherType < 4.5) {
    float stormClouds = fbm(coord * 1.3 + vec3(0.0, uTime * 0.04, 0.0), 0.0);
    sky *= 0.45 + stormClouds * 0.25;
    sky += vec3(0.8, 0.85, 1.0) * uFlashIntensity * 0.7;
  }

  if (uQuality > 0.5 && uWeatherType > 4.5 && uWeatherType < 5.5) {
    float fog = fbm(coord * 0.7 + vec3(uTime * 0.008), uQuality);
    fog = smoothstep(0.0, 1.0, fog);
    sky = mix(sky, vec3(0.55, 0.58, 0.62), fog * 0.65);
  }

  if (uWeatherType > 2.5 && uWeatherType < 3.5) {
    float snowLine = smoothstep(0.0, 0.2, 1.0 - uv.y);
    sky = mix(sky, vec3(0.92, 0.94, 0.97), snowLine * 0.35);
  }

  if (uWeatherType > 1.5 && uWeatherType < 2.5) {
    sky *= 0.78;
  }

  sky = mix(sky, vec3(0.15, 0.17, 0.22), clouds * 0.3 * uTransition);

  gl_FragColor = vec4(sky, 1.0);
}
