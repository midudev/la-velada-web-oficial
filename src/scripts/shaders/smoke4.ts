// shader original https://www.shadertoy.com/view/mdSGzK
import { simpleNoise } from "./commonChunks"

export const smoke4 = /* glsl */`
float speed = .3;
float scale = 2.2;
const int octaves = 4;
bool turbulence = false;
float shift = .3;
float startAmp = .8;
${simpleNoise}
float fbm (in vec3 st) {
    // Initial values
    float value = 0.0;
    float amplitude = startAmp;
    float frequency = 0.;

    // Loop of octaves
    for (int i = 0; i < octaves; i++) {
        value += amplitude * snoise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    float time = iTime * speed;
    float plainY = uv.y + .5;

    uv *= scale;

    float mag = .2;

    float n = fbm(vec3(uv, time*.2));
    n = fbm(vec3(uv - time*.2, n * mag + time*.1));
    n = fbm(vec3(uv - time*.4, n * mag + time*.2));

    if (turbulence) {
        n = abs(n);
    } else {
        n = n*.5 + .5;
    }

    n = pow(n, shift + plainY * (1.-shift));
    n *= 1. - plainY;

    vec3 color = vec3(n*.98, n*.95, n*.997);

    fragColor = vec4(color,1.0);
}
  `
