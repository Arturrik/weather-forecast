precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uIntensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float drop = 0.0;

  for (float i = 0.0; i < 12.0; i++) {
    vec2 seed = vec2(i * 0.17, i * 0.31);
    float x = hash(seed);
    float speed = 0.3 + hash(seed + 1.0) * 0.5;
    float y = fract(hash(seed + 2.0) + uTime * speed);
    float w = 0.002 + hash(seed + 3.0) * 0.003;
    drop += smoothstep(w, 0.0, abs(uv.x - x)) * smoothstep(0.02, 0.0, abs(uv.y - y));
  }

  vec3 color = vec3(0.6, 0.75, 0.95) * drop * uIntensity;
  gl_FragColor = vec4(color, drop * uIntensity * 0.3);
}
