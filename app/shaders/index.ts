import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import rainFragmentShader from "./rain.frag";

export { vertexShader, fragmentShader, rainFragmentShader };

export const WEATHER_TYPE_MAP = {
  neutral: 0,
  clear: 1,
  rain: 2,
  snow: 3,
  storm: 4,
  fog: 5,
  cloudy: 6,
} as const;
