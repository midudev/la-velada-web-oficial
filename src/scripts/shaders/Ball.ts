export const ball = /* glsl */`
// 2D rotate
mat2 rotate(in float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, s, -s, c);
}

// noise background is baced on 李明杰VIP:
// https://www.shadertoy.com/view/4sVBDm
// -----------------------------------------
//noise background
const float noiseIntensity = 2.8;
const float noiseDefinition = 0.6;
const vec2 glowPos = vec2(-2., 0.);

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(-0.940,-0.880))) * 43758.5453);
}

float noise( in vec2 p ){
    p*=noiseIntensity;
    vec2 i = floor( p );
    vec2 f = fract( p );
	vec2 u = f*f*(3.-2.*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

float fbm( in vec2 uv ){
	uv *= 5.;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
    float f  = 0.5*noise( uv ); uv = m*uv;
    f += 0.2500*noise( uv ); uv = m*uv;
    f += 0.1250*noise( uv ); uv = m*uv;
    f += 0.0625*noise( uv ); uv = m*uv;

	f = 0.5 + .5*f;
    return f;
}

vec3 bg(vec2 uv ){
    float velocity = iTime * 0.5;
    float intensity = sin(uv.x*9.*sin(iTime*0.1)+velocity*3.)*noise(uv*2.)*3.0+.3;
    uv.y -= 4.;
    vec2 bp = uv+glowPos;
    uv *= noiseDefinition;

    //ripple
    float rb = fbm(vec2(uv.x*.5-velocity*.03, uv.y))*.1;
    uv += rb;

    //coloring
    float rz = fbm(uv*.9+vec2(velocity*.35, 0.0));
    rz *= dot(bp*intensity,bp);

    //bazooca line
    rz *= sin(uv.x*0.1+velocity*0.8);

    //lightning
    rz *= 5.*sin(uv.x*0.1+velocity*sin(iTime));

    vec3 bgColor = vec3(cos(iTime),0.45 * sin(iTime*0.2),sin(iTime*0.3));
    vec3 col = bgColor/(.1-rz);

    return sqrt(abs(col));
}
// -----------------------------------------
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Wide-angle lens is baced on Menger Sponge Variation
    // https://www.shadertoy.com/view/ldyGWm
    vec3 st = (vec3(2.0 * fragCoord - iResolution.xy, iResolution.y));
    st = normalize(vec3(st.xy, sqrt(max(st.z * st.z - dot(st.xy, st.xy) *4.*sin(iTime*0.5),0.))));

    st.xy *= rotate(iTime*0.5);

    vec3 bgCol = bg(st.xy)*(1.9-abs(st.y*2.));

	fragColor = vec4(bgCol, 1.0);
}

	`
