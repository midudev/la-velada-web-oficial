export const mouseMove = /* glsl */`
// Distress Flare
// by athibaul

// Inspired by a shot from Woodkid's music video "In Your Likeness"
// https://youtu.be/Jw2XwhMxPqU?t=161

vec3 flareCol = vec3(0.15, 1.0, 0.4);
const float SPEED = 2.5;

float noise(float x)
{
    return 2.*texture2D(iChannel0, vec2(x+0.5,0)/256.).r-1.;
}

float fbm1D(float x)
{
    return noise(x)*0.5 + noise(2.*x)*0.25 + noise(4.*x)*0.125;
}


float noise2D(vec2 p)
{
    p = floor(p) + smoothstep(0.,1.,fract(p));
    return texture2D(iChannel0, (p+0.5)/256.).r;
}
float fbm2D(vec2 p)
{
    return 0.5*noise2D(p)+0.25*noise2D(2.*p)+0.125*noise2D(4.*p)+0.0625*noise2D(8.*p);
}


float intensityAtTime(float t)
{
    return fbm1D(t*3.)*0.5 + 0.5;
}

float ligIntensity(float t)
{
    return exp(5.*(intensityAtTime(t)-0.5));
}


vec3 flareColor(vec2 p, float time, float dmin)
{
    // Hexagonal shape
    vec2 q = abs(p);
    vec2 n = vec2(-sqrt(3.)/2., 0.5);
    q = dot(q,n) > 0. ? reflect(q,n) : q;
    float d = dot(q,n*vec2(-1,1));
    float intensity = ligIntensity(time) / (1.+abs(p.y));
    return flareCol * pow(d+dmin, -2.) * 0.005 * intensity;
}

vec3 bokeh(vec2 p, float t, float smoo)
{
    float bok = smoothstep(0.5+smoo,0.5-smoo,length(p))
        * (0.5+smoothstep(0.0,0.5, length(p)));
    return bok * 0.01 * flareCol * ligIntensity(t);
}

vec3 bokeh2(vec2 p, float t, float smoo)
{
    float bok = smoothstep(0.5+smoo,0.5-smoo,length(p));
    return bok * 0.01 * flareCol * ligIntensity(t);
}

const vec2 vSmoke = normalize(vec2(1,-3)); // Velocity of smoke rel. to flare
float smokeDensity(vec2 p, float time)
{
    vec2 v = vSmoke;
    vec2 q = mat2(v.x,-v.y,v.y,v.x) * p;
   	q.y += fbm1D((q.x-time)*6.)*0.03*q.x;
    float density = intensityAtTime(time-0.9*q.x);
    density = smoothstep(0.2,0.6, density);
    float width = 0.01 + 0.06*q.x;
    return smoothstep(0.,0.01,q.x) * smoothstep(width,0.0,abs(q.y)) * density;
}

vec3 smokeColor(vec2 p, float time)
{
    float den1 = smokeDensity(p, time);
    float eps = 0.1;
    float den2 = smokeDensity(p*(1.-eps), time);
    float lig = max((den1-den2)/eps+0.1, 0.0);
    return vec3(lig*den1*flareCol) * pow(length(p)+0.5, -2.) * 0.15;
}

float cloudsDen(vec2 p)
{
    vec2 q = p;
    q += fbm2D(3.*q)*0.5;
    q *= mat2(0.6,0.8,-0.8,0.6);
    float den = fbm2D(5.*q);
    return den;
}

vec4 midCloudsCol(vec2 p, float time)
{
    float den1 = cloudsDen(p - time*vSmoke);
    float den2 = cloudsDen(p*0.5 - time*vSmoke);
    float lig = max(den1-den2, 0.);
    float intensity = pow(2.+length(p), -2.) * 2.;
    return vec4(flareCol * lig * intensity, den1);
}

vec3 backCloudsCol(vec2 p, float time)
{
    // Depth is faked by moving the background slower, and the foreground faster
    float den = cloudsDen(1.3*(p - 0.6*time*vSmoke));
    return flareCol * den * pow(1.+length(p), -2.)*0.2;
}

float frontCloudsDen(vec2 p, float time)
{
    float den = cloudsDen(0.5*(p-2.*time*vSmoke));
    return den;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 p = (fragCoord*2.-iResolution.xy)/iResolution.y;

    vec2 mouse = iMouse / iResolution.xy;
    mouse.x *= iResolution.x / iResolution.y;
		mouse.x= mouse.x*2.-2. ;
		mouse.y= mouse.y*4.-1. ;

    float time = iTime*SPEED;

    float camTime = time*2.;
    vec2 q = p + vec2(fbm1D(camTime+50.), fbm1D(camTime+20.))*0.1 - vec2(mouse.x,mouse.y)*.001;
		vec2 qf=q- vec2(mouse.x,mouse.y);
    vec3 col = vec3(0.);

    col += backCloudsCol(q, time);
    vec4 midClouds = midCloudsCol(q, time);
    col = mix(col, midClouds.rgb, midClouds.a);

	col += flareColor(qf, time, 0.);
    col += smokeColor(qf, time);

    col = mix(col, vec3(0.), 0.5*frontCloudsDen(q, time));

    // Lens flare

    col += bokeh(5.*q, time, 0.5) * 10.;

    col += flareColor(2.*p-qf, time, 0.1) * 0.15;
    col += bokeh(2.*p-q, time, 0.05) * 0.5;
    col += bokeh2(3.*(4.*p-qf), time, 0.2) * 0.5;
    col += bokeh2(3.*(p-2.*qf), time, 0.2) * 0.5;
    col += bokeh2(5.*(3.*p-2.*qf), time, 0.1) * 0.3;
    col += bokeh2(5.*(q+p), time, 0.2) * 0.5;
    col += flareColor(5.*(p+0.33*qf), time, 0.2)*0.5;


    //col = mix(col, 1.-4./27./(col*col), step(2./3.,col));
    col = 1.-exp(-col);

    col = sqrt(col);

    fragColor = vec4(col,1.0);
}
  `
