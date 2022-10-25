#define PI 3.1415926535897932384626433832795

uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uTime;

varying float vElevation;
varying vec2 vUV;


void main() {

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 outputColor = mix(uDepthColor, uSurfaceColor, mixStrength);

    float gradientFromCenter = distance(vUV,vec2(0.5));
    float angle = atan(vUV.x - 0.5, vUV.y - 0.5) / (PI * 2.0) + 0.5;
    float radius = 0.25 + sin(angle * 100.0 + uTime) * 0.0035;
    float circleMask = 1.0 - smoothstep(0.5, 0.7, gradientFromCenter + radius);

    gl_FragColor = vec4(outputColor, circleMask);
}