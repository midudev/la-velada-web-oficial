export const RayMarching = /* glsl */`
/*
	Neon Lit Hexagons
	-----------------

	I needed a break from a few technical shaders I've beem hacking away at, so I finished an old
	geometric example that'd been sitting on the blocks for a while.

	3D hexagon tech imagery is a bit of a cliche, but I've always been a fan. Most tend to be high
	quality pathtraced renderings, but since this is a realtime raymarched example, I had to make
	a lot of concessions. The glowing neon lights were inspired by some of Shau's examples, some
	online imagery, and practically half the demos out there. :)

	I tried to create the glowing effect without the use of a volumetric pass, but my eyes weren't
	accepting the results, which meant the observant people on here -- pretty much everyone -- would
	notice immediately, so I put a relatively cheap one in. The improvements were immediate, but it
	was at the cost of rendering speed... I'm just hoping no one notices the lack of reflections from
	the neon lights. :) I have a pretty quick laptop, but ever since the WebGL 2 update, it hasn't
	enjoyed compiling extra passes, so reflections had to go. At a later stage, I might attempt to
	fake them in some way.

	There are a couple of surface detail defines below that I had to leave out. I also came pretty
	close to greebling the surfaces, but figured that might be overkill. In the end, I took the
	"less is more" approach. However, I intend to put together a greebled surface pretty soon.


    // Other neon-looking examples:

	// Shau has a heap of bright glowing examples, but here's a few.
	OTT - shau
	https://www.shadertoy.com/view/4sVyDd

	43% Burnt - shau
	https://www.shadertoy.com/view/XljBWW

	Angle Grinder - shau
	https://www.shadertoy.com/view/XtsfWX


    // Great example.
	Neon World - zguerrero
    https://www.shadertoy.com/view/MlscDj

*/



// Hexagon: 0, Dodecahedron: 1, Circle: 2.
// Squares, stars, etc, are possible too, but I didn't include those.
#define SHAPE 0


// Details usually make a scene more interesting. In this case, however, they seemed a
// little expensive, so I left them out.
//
// I wanted to include the grooves, at least, but I figured speed on slower machines was
// more important.
//#define ADD_DETAIL_GROOVE
//#define ADD_DETAIL_BOLT

// Animating the neon lights, or not. I find them a little too distracting,
// so the default is "off."
//#define ANIMATE_LIGHTS

// If Borg green is more your thing. :)
//#define GREEN_GLOW

// Maximum ray distance.
#define FAR 50.

// Standard 2D rotation formula.
mat2 r2(in float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// vec2 to float hash.
float hash21(vec2 p){

    float n = dot(p, vec2(7.163, 157.247));
    return fract(sin(n)*43758.5453);
}

// vec3 to float hash.
float hash31(vec3 p){

    float n = dot(p, vec3(13.163, 157.247, 7.951));
    return fract(sin(n)*43758.5453);
}


// Commutative smooth maximum function. Provided by Tomkh, and taken
// from Alex Evans's (aka Statix) talk:
// http://media.lolrus.mediamolecule.com/AlexEvans_SIGGRAPH-2015.pdf
// Credited to Dave Smith @media molecule.
float smax(float a, float b, float k){

   float f = max(0., 1. - abs(b - a)/k);
   return max(a, b) + k*.25*f*f;
}

/*
// Commutative smooth minimum function. Provided by Tomkh, and taken
// from Alex Evans's (aka Statix) talk:
// http://media.lolrus.mediamolecule.com/AlexEvans_SIGGRAPH-2015.pdf
// Credited to Dave Smith @media molecule.
float smin(float a, float b, float k){

   float f = max(0., 1. - abs(b - a)/k);
   return min(a, b) - k*.25*f*f;
}

*/

/*
// Tri-Planar blending function. Based on an old Nvidia tutorial.
vec3 tex3D( sampler2D tex, in vec3 p, in vec3 n ){

    n = max((abs(n) - .2)*7., .001); // n = max(abs(n), .001), etc.
    n /= (n.x + n.y + n.z );

	vec3 tx = (texture(tex, p.yz)*n.x + texture(tex, p.zx)*n.y + texture(tex, p.xy)*n.z).xyz;

    return tx*tx;
}
*/

// Tri-Planar blending function. Based on an old Nvidia writeup:
// GPU Gems 3 - Ryan Geiss: https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch01.html
vec3 tex3D(sampler2D t, in vec3 p, in vec3 n){

    // We only want positive normal weightings. The normal is manipulated to suit
    // your needs.
    n = max(abs(n) - .2, .001); // n = max(n*n - .1, .001), etc.
    //n /= dot(n, vec3(1)); // Rough renormalization approximation.
    n /= length(n); // Renormalizing.

	vec3 tx = texture(t, p.yz).xyz; // Left and right sides.
    vec3 ty = texture(t, p.zx).xyz; // Top and bottom.
    vec3 tz = texture(t, p.xy).xyz; // Front and back.

    // Blending the surrounding textures with the normal weightings. If the surface is facing
    // more up or down, then a larger "n.y" weighting would make sense, etc.
    //
    // Textures are stored in sRGB (I think), so you have to convert them to linear space
    // (squaring is a rough approximation) prior to working with them... or something like that. :)
    // Once the final color value is gamma corrected, you should see correct looking colors.
    return (tx*tx*n.x + ty*ty*n.y + tz*tz*n.z);

}

// More concise, self contained version of IQ's original 3D noise function.
float noise3D(in vec3 p){

    // Just some random figures, analogous to stride. You can change this, if you want.
	const vec3 s = vec3(113, 157, 1);

	vec3 ip = floor(p); // Unique unit cell ID.

    // Setting up the stride vector for randomization and interpolation, kind of.
    // All kinds of shortcuts are taken here. Refer to IQ's original formula.
    vec4 h = vec4(0., s.yz, s.y + s.z) + dot(ip, s);

	p -= ip; // Cell's fractional component.

    // A bit of cubic smoothing, to give the noise that rounded look.
    p = p*p*(3. - 2.*p);

    // Standard 3D noise stuff. Retrieving 8 random scalar values for each cube corner,
    // then interpolating along X. There are countless ways to randomize, but this is
    // the way most are familar with: fract(sin(x)*largeNumber).
    h = mix(fract(sin(h)*43758.5453), fract(sin(h + s.x)*43758.5453), p.x);

    // Interpolating along Y.
    h.xy = mix(h.xz, h.yw, p.y);

    // Interpolating along Z, and returning the 3D noise value.
    float n = mix(h.x, h.y, p.z); // Range: [0, 1].

    return n;//abs(n - .5)*2.;
}

// Simple fBm to produce some clouds.
float fbm(in vec3 p){

    // Four layers of 3D noise.
    //p /= 1.5;
    //p -= vec3(0, 0, iTime*1.);
    return 0.5333*noise3D( p ) + 0.2667*noise3D( p*2.02 ) + 0.1333*noise3D( p*4.03 ) + 0.0667*noise3D( p*8.03 );

}



// The path is a 2D sinusoid that varies over time, depending upon the frequencies, and amplitudes.
vec2 path(in float z){

    //return vec2(0);

    //return vec2(sin(z * 0.15)*2.4, cos(z * 0.075)*.15);

    return vec2(sin(z * 0.15)*2.4, 0);
}




//////
//float objID, svObjID;

// Helper vector. If you're doing anything that involves regular triangles or hexagons, the
// 30-60-90 triangle will be involved in some way, which has sides of 1, sqrt(3) and 2.
const vec2 s = vec2(.866025, 1);//const vec2 s = vec2(1, 1.7320508); //


// The 2D hexagonal isosuface function: If you were to render a horizontal line and one that
// slopes at 60 degrees, mirror, then combine them, you'd arrive at the following.
float hex(in vec2 p){

    //return length(p);
    p = abs(p);

    // Below is equivalent to:
    return max(p.x*.866025 + p.y*.5, p.y);

    //return max(dot(p, s*.5), p.x); // Hexagon.

}

/*
// More accurate formula, but involves more operations and didn't improve quality by any
// significant amount, so I've used the estimation below.
float hexPylon(vec2 p2, float pz, float r, float ht){

    vec3 p = vec3(p2.x, pz, p2.y);

    // Note the "*1.5" You need to take the minimum of
    // long-sided rectangles, not squares. Squares will give
    // you a dodecahedron.
    vec3 b = vec3(r*1.5, ht, r);

    //p.xz = abs(p.xz);
    //p.xz = vec2(p.x*.866025 + p.z*.5, p.z);

    b -= .015;
    //p.xz = r2(-3.14159/3.)*q.xz;
  	float d1 = length(max(abs(p) - b, 0.));
    p.xz = r2(6.2831/3.)*p.xz;
    float d2 = length(max(abs(p) - b, 0.));

    p.xz = r2(6.2831/3.)*p.xz;
    float d3 = length(max(abs(p) - b, 0.));
    return max(max(d1, d2), d3) - .015;
}
*/

/*
// Signed distance to a regular hexagon -- using IQ's more exact method.
float sdHexagon(in vec2 p, in float r){

  const vec3 k = vec3(-.8660254, .5, .57735); // pi/6: cos, sin, tan.

  // X and Y reflection.
  p = abs(p);
  p -= 2.*min(dot(k.xy, p), 0.)*k.xy;

  // Polygon side.
  return length(p - vec2(clamp(p.x, -k.z*r, k.z*r), r))*sign(p.y - r);

}

// IQ's extrusion formula, with a bit of rounding (the .015 bit) thrown in.
float opExtrusion(in float sdf, in float pz, in float h)
{
    vec2 w = vec2( sdf, abs(pz) - h );
  	return min(max(w.x,w.y), 0.) + length(max(w + .015, 0.)) - .015;
}

// A technically correct hexagonal pylon formual.
float hexPylon(vec2 p2, float pz, float r, float ht){

    float hex = sdHexagon(p2, r);
    return opExtrusion(hex, pz, ht);
}
*/

// Normally, I'd say this is the hexagonal pylon distance function. However, I should
// probably make the distinction between a fully bonafide distance function and something
// that estimates it. This is a bound of sorts. There's not a great deal between it and
// the real thing, but it does exhibit different behaviour away from the surface, which
// can affect things like shadows, etc. However, as you can see, in this situation, you
// can't really tell. I figured I'd mention this, because myself and others use a lot of
// these kind of functions.
//
// By the way, a more exact formula is commented out above.
//
// Hexagonal pylon field. There's also defines for a dodecahedron and a cylinder.
float hexPylon(vec2 p2, float pz, float r, float ht){

    vec3 p = vec3(p2.x, pz, p2.y);
    vec3 b = vec3(r, ht, r);


    #if SHAPE == 0
    // Hexagon.
    p.xz = abs(p.xz);
    p.xz = vec2(p.x*.866025 + p.z*.5, p.z);
    // The ".015" is a subtle rounding factor. Zero gives sharp edges,
    // and larger numbers give a more rounded look.
  	return length(max(abs(p) - b + .015, 0.)) - .015;
    #elif SHAPE == 1
    // Dodecahedron.
    p.xz = abs(p.xz);
    p2 = p.xz*.8660254 + p.zx*.5;
    p.xz = vec2(max(p2.x, p2.y), max(p.z, p.x));
    // The ".015" is a subtle rounding factor. Zero gives sharp edges,
    // and larger numbers give a more rounded look.
  	return length(max(abs(p) - b + .015, 0.)) - .015;
    #else
    // Cylinder -- IQ's cylinder function, to be precise, so I think this particular
    // function is a proper distance field.
    p.xy = abs(vec2(length(p.xz), p.y)) - b.xy + .015;
    return min(max(p.x, p.y), 0.) + length(max(p.xy, 0.)) - .015;
    #endif


}



// IDs for the neon lights. Added at the last minute. Identifying things can be tiresome. Individual
// objects need to be identified, and sometimes, objects within objects need identification too.
// In this case, there are four pylon groupings. Each pylon object contains a neon light object that
// is either on or off.
//
// If you're seting IDs withing the distance function, they can be lost when calling things like the
// "normal" function, etc. Therefore, you need extra variables to save the IDs directly after calling
// the trace function. Then there's the matter of ID sorting, which should be done outside the loop...
// Even with a "struct," or something to that effect, it can still be messy. Having said that, I might
// start trying to streamline and formalize the process.
vec4 litID;
float svLitID;

// The pylon and light distance field.
// Variables in order: p.xz, p.y, radius, height, ID, direction (unused).
float objDist(vec2 p, float pH, float r, float ht, inout float id, float dir){

    // Neon light height: Four levels, plus the height is divided by two.
    const float s = 1./16.; //1./4./2.*.5;

    // Main hexagon pylon.
    float h1 = hexPylon(p, pH, r, ht);

    #ifdef ADD_DETAIL_GROOVE
    // I like this extra detail, but it was a little too expensive.
	h1 = max(h1, -hexPylon(p, pH + ht, r - .06, s/4.)); // Extra detail.
    #endif

    #ifdef ADD_DETAIL_BOLT
    // An alternative extra detail. Also a little on the expensive side.
    h1 = min(h1, hexPylon(p, pH, .1, ht + s/4.)); // Extra detail.
    #endif



    // Thin hexagon slab -- sitting just below the top of the main hexagon. It's
    // lit differently to represent the neon portion.
    float h2 = hexPylon(p, pH + ht - s, r + .01, s/3.);


    // Opens a space around the neon lit hexagon. Used, if the radius of "h2" is
    // less that "h1," which isn't the case here.
    //h1 = smax(h1, -(abs(pH + ht - s) - s/3.), .015);

    // Identifying the main hexagon pylon or the neon lit portion.
    id = h1<h2? 0. : 1.;

    // Return the closest object.
    return min(h1, h2);

}

// Height field for the hexagon.
float hexHeight(vec2 p){

    // Random height.
    //return hash21(p + 57.)*.75;

    // Any kind of cheap flowing height field will do.
    return dot(sin(p*2. - cos(p.yx*1.4)), vec2(.25)) + .5;


    // Two layers. Not used, because we're trying to keep costs down.
    //float n1 = dot(sin(p*2. - cos(p.yx*1.4)), vec2(.25)) + .5;
    //float n2 = dot(sin(p.yx*8. - cos(p*6.)), vec2(.25)) + .5;
    //return n1*.85 + n2*.15;
}




// This function returns the hexagonal grid coordinate for the grid cell, and the corresponding
// hexagon cell ID - in the form of the central hexagonal point. That's basically all you need to
// produce a hexagonal grid.
//
// When working with 2D, I guess it's not that important to streamline this particular function.
// However, if you need to raymarch a hexagonal grid, the number of operations tend to matter.
// This one has minimal setup, one "floor" call, a couple of "dot" calls, a ternary operator, etc.
// To use it to raymarch, it's necessary to double up on everything -- in order to deal with
// overlapping fields from neighboring cells, so the fewer operations the better.
vec4 getHex(vec2 p, float pH){

    // The hexagon centers: Two sets of repeat hexagons are required to fill in the space, and
    // the two sets are stored in a "vec4" in order to group some calculations together. The hexagon
    // center we'll eventually use will depend upon which is closest to the current point. Since
    // the central hexagon point is unique, it doubles as the unique hexagon ID.
    vec4 hC = floor(vec4(p, p - vec2(0, .5))/s.xyxy) + vec4(0, 0, 0, .5);
    vec4 hC2 = floor(vec4(p - vec2(.5, .25), p - vec2(.5, .75))/s.xyxy) + vec4(.5, .25, .5, .75);

    // Centering the coordinates with the hexagon centers above.
    vec4 h = vec4(p - (hC.xy + .5)*s, p - (hC.zw + .5)*s);
    vec4 h2 = vec4(p - (hC2.xy + .5)*s, p - (hC2.zw + .5)*s);

    // Hexagon height.
    vec4 ht = vec4(hexHeight(hC.xy), hexHeight(hC.zw), hexHeight(hC2.xy), hexHeight(hC2.zw));
    // Restricting the heights to five levels... The ".02" was a hack to take out the lights
    // on the ground tiles, or something. :)
    ht = floor(ht*4.99)/4./2. + .02;

    // The pylon radius. Lower numbers leave gaps, and heigher numbers give overlap. There's not a
    // lot of room for movement, so numbers above ".3," or so give artefacts.
    const float r = .25; // .21 to .3.
    vec4 obj = vec4(objDist(h.xy, pH, r, ht.x, litID.x, 1.), objDist(h.zw, pH, r, ht.y, litID.y, -1.),
                    objDist(h2.xy, pH, r, ht.z, litID.z, -1.), objDist(h2.zw, pH, r, ht.w, litID.w, 1.));


    //tempD = min(min(obj.x, obj.y), min(obj.z, obj.w));

    // Nearest hexagon center (with respect to p) to the current point. In other words, when
    // "h.xy" is zero, we're at the center. We're also returning the corresponding hexagon ID -
    // in the form of the hexagonal central point.
    //
    h = obj.x<obj.y ? vec4(h.xy, hC.xy) : vec4(h.zw, hC.zw);
    h2 = obj.z<obj.w ? vec4(h2.xy, hC2.xy) : vec4(h2.zw, hC2.zw);

    vec2 oH = obj.x<obj.y ? vec2(obj.x, litID.x) : vec2(obj.y, litID.y);
    vec2 oH2 = obj.z<obj.w ? vec2(obj.z, litID.z) : vec2(obj.w, litID.w);

    //return oH<oH2 ? vec4(h.xy, hC.xy) : vec4(h2.xy, hC2.xy);
    return oH.x<oH2.x ? vec4(oH,  h.zw) : vec4(oH2, h2.zw);

}

// Some IDs. One to save the unique hexagonal center coordinates and an ID for the part of the
// pylon that is lit. These were added on the fly. There'd be cleaner ways to do this.
vec2 v2Rnd, svV2Rnd;
float gLitID;



// Reducing the heightmap function to a single texel lookup - via the stone texture which was
// generated outside the distance function in the onscreen buffer, of course.
//
// Using the single pass system, there would have been no other option than to generate the stone
// texture several times a frame... or beg someone behind the scenes to provide a 2D multilayered
// Voronoi heightmap. :)
float heightMap(in vec3 p){

    // The stone texture is tileable, or repeatable, which means the pattern is slightly
    // repetitive, but not too bad, all things considered. Note that the offscreen buffer
    // doesn't wrap, so you have to do that yourself. Ie: fract(p) - Range [0, 1].
    //return Voronoi(p.xy*2.);//texture2D(texChannel0, fract(p/2.), -100.).w;

    const float sc = 1.;
    vec4 h = getHex(p.xz*sc, -p.y*sc);

    v2Rnd = h.zw;

    gLitID = h.y;

    return h.x/sc;

}

///////

// Standard setup for a plane at zero level with a perturbed surface on it.
float map(vec3 p){

    float c = heightMap(p);

    //objID = 1.;

    return c*.7;

}

// Global glow variable.
vec3 glow;

// Determines whether the neon light should be switched on, or not.
float getRndID(vec2 p){

    #ifdef ANIMATE_LIGHTS
    // Blinking version. Interesting, but I found it too distracting.
    float rnd = hash21(p);
    return smoothstep(.5, .875, sin(rnd*6.283 + iTime));
    #else
    return hash21(p) - .75;
    #endif


}

// Standard raymarching routine, with some custom glow mixed in.
float trace(vec3 ro, vec3 rd){

    // Applying some jitter to the jump off point to alleviate volumetric banding.
    float t = hash31(ro + rd)*.25, d, ad;

    glow = vec3(0);

    // It's a kind of expensive function, so I'm trying to minimize the iteration number.
    // In fact, since the GPU unrolls everything, this number should always be minimized.
    for (int i = 0; i<80; i++){

        d = map(ro + rd*t);
        ad = abs(d);

     	if(ad<.001*(t*.125 + 1.) || t>FAR) break;

        // Applying some glow. There are probably better ways to go about it, but this
        // will suffice. If the ray passes within "gd" units of the neon object, add some
        // distance-based glow.
        const float gd = .1;
        float rnd = getRndID(v2Rnd);
        if(rnd>0. && gLitID == 1. && ad<gd) { // && ad<.05
			float gl = .2*(gd - ad)/gd/(1. + ad*ad/gd/gd*8.);
            // Colors are possible, but I just wanted the scaler value, which is colorized
            // outside the loop.
            glow += gl;
        }

        t += d;  // Advance the ray.
    }


    return min(t, FAR);
}




/*
void getGlow(vec3 ro, vec3 rd, float t){

   glow = vec3(0);
   float t2 = hash31(ro + rd)*.25, d, ad;
   t2 = max(t2 - 3., 0.);

   for (int i = 0; i<30; i++){

		d = map(ro + rd*t2);
        ad = abs(d);

        if(ad<.001*(t2*.125 + 1.) || t2>FAR) break;

        const float gd = .1;
        float rnd = getRndID(vRnd);
        if(rnd>0. && gLitID == 1. && ad<gd) { // && ad<.05
			float gl = .2*(gd - ad)/gd/(1. + ad*ad/gd/gd*8.);
            glow += gl;
        }

		t2 += d;

    }



}
*/

/*
// Second pass, which is the first, and only, reflected bounce.
// Virtually the same as above, but with fewer iterations and less
// accuracy.
//
// The reason for a second, virtually identical equation is that
// raymarching is usually a pretty expensive exercise, so since the
// reflected ray doesn't require as much detail, you can relax things
// a bit - in the hope of speeding things up a little.
float traceRef(vec3 ro, vec3 rd){

    float t = 0., d;

    for (int i = 0; i<32; i++){

        d = map(ro + rd*t);

        if(abs(d)<.002*(t*.25 + 1.) || t>FAR) break;

        t += d;
    }

    return min(t, FAR);
}
*/


// Cheap shadows are hard. In fact, I'd almost say, shadowing repeat objects - in a setting like this - with limited
// iterations is impossible... However, I'd be very grateful if someone could prove me wrong. :)
float softShadow(vec3 ro, vec3 lp, float k){

    // More would be nicer. More is always nicer, but not really affordable.
    const int maxIterationsShad = 32;

    vec3 rd = (lp-ro); // Unnormalized direction ray.

    float shade = 1.0;
    float dist = 0.01;
    float end = max(length(rd), 0.001);
    float stepDist = end/float(maxIterationsShad);

    rd /= end;

    // Max shadow iterations - More iterations make nicer shadows, but slow things down. Obviously, the lowest
    // number to give a decent shadow is the best one to choose.
    for (int i=0; i<maxIterationsShad; i++){

        float h = map(ro + rd*dist);
        //shade = min(shade, k*h/dist);
        shade = min(shade, smoothstep(0.0, 1.0, k*h/dist)); // Subtle difference. Thanks to IQ for this tidbit.
        //dist += min(h, stepDist); // So many options here, and none are perfect: dist += min( h, 0.2 ), etc
        dist += clamp(h, .02, .25); // So many options here, and none are perfect: dist += min( h, 0.2 ), etc

        // Early exits from accumulative distance function calls tend to be a good thing.
        if (h<0. || dist > end) break;
    }

    // I've added 0.5 to the final shade value, which lightens the shadow a bit. It's a preference thing.
    // Really dark shadows look too brutal to me.
    return min(max(shade, 0.) + .05, 1.);
}



// Standard normal function. It's not as fast as the tetrahedral calculation, but more symmetrical. Due to
// the intricacies of this particular scene, it's kind of needed to reduce jagged effects.
vec3 getNormal(in vec3 p) {
	const vec2 e = vec2(0.0025, 0);
	return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy),	map(p + e.yyx) - map(p - e.yyx)));
}



/*
// Tetrahedral normal, to save a couple of "map" calls. Courtesy of IQ.
vec3 getNormal( in vec3 p ){

    // Note the slightly increased sampling distance, to alleviate
    // artifacts due to hit point inaccuracies.
    vec2 e = vec2(0.0025, -0.0025);
    return normalize(
        e.xyy * map(p + e.xyy) +
        e.yyx * map(p + e.yyx) +
        e.yxy * map(p + e.yxy) +
        e.xxx * map(p + e.xxx));
}
*/

/*
// Normal calculation, with some edging and curvature bundled in.
vec3 getNormal(vec3 p, inout float edge, inout float crv, float ef) {

    // Roughly two pixel edge spread, but increased slightly with larger resolution.
    vec2 e = vec2(ef/mix(450., iResolution.y, .5), 0);

	float d1 = map(p + e.xyy), d2 = map(p - e.xyy);
	float d3 = map(p + e.yxy), d4 = map(p - e.yxy);
	float d5 = map(p + e.yyx), d6 = map(p - e.yyx);
	float d = map(p)*2.;

    edge = abs(d1 + d2 - d) + abs(d3 + d4 - d) + abs(d5 + d6 - d);
    //edge = abs(d1 + d2 + d3 + d4 + d5 + d6 - d*3.);
    edge = smoothstep(0., 1., sqrt(edge/e.x*2.));


    // Wider sample spread for the curvature.
    //e = vec2(12./450., 0);
	//d1 = map(p + e.xyy), d2 = map(p - e.xyy);
	//d3 = map(p + e.yxy), d4 = map(p - e.yxy);
	//d5 = map(p + e.yyx), d6 = map(p - e.yyx);
    //crv = clamp((d1 + d2 + d3 + d4 + d5 + d6 - d*3.)*32. + .5, 0., 1.);


    e = vec2(.0025, 0); //iResolution.y - Depending how you want different resolutions to look.
	d1 = map(p + e.xyy), d2 = map(p - e.xyy);
	d3 = map(p + e.yxy), d4 = map(p - e.yxy);
	d5 = map(p + e.yyx), d6 = map(p - e.yyx);

    return normalize(vec3(d1 - d2, d3 - d4, d5 - d6));
}
*/

// Ambient occlusion, for that self shadowed look.
// Based on the original by IQ.
float calcAO(in vec3 p, in vec3 n)
{
	float sca = 4., occ = 0.0;
    for( int i=1; i<6; i++ ){

        float hr = float(i)*.125/5.;
        float dd = map(p + hr*n);
        occ += (hr - dd)*sca;
        sca *= .75;
    }
    return clamp(1. - occ, 0., 1.);

}


// Texture bump mapping. Four tri-planar lookups, or 12 texture lookups in total. I tried to
// make it as concise as possible. Whether that translates to speed, or not, I couldn't say.
vec3 texBump( sampler2D tx, in vec3 p, in vec3 n, float bf){

    const vec2 e = vec2(.001, 0);

    // Three gradient vectors rolled into a matrix, constructed with offset greyscale texture values.
    mat3 m = mat3(tex3D(tx, p - e.xyy, n), tex3D(tx, p - e.yxy, n), tex3D(tx, p - e.yyx, n));

    vec3 g = vec3(.299, .587, .114)*m; // Converting to greyscale.
    g = (g - dot(tex3D(tx,  p , n), vec3(.299, .587, .114)))/e.x;

    // Adjusting the tangent vector so that it's perpendicular to the normal -- Thanks to
    // EvilRyu for reminding me why we perform this step. It's been a while, but I vaguely
    // recall that it's some kind of orthogonal space fix using the Gram-Schmidt process.
    // However, all you need to know is that it works. :)
    g -= n*dot(n, g);

    return normalize( n + g*bf ); // Bumped normal. "bf" - bump factor.

}


// Very basic pseudo environment mapping... and by that, I mean it's fake. :) However, it
// does give the impression that the surface is reflecting the surrounds in some way.
//
// More sophisticated environment mapping:
// UI easy to integrate - XT95
// https://www.shadertoy.com/view/ldKSDm
vec3 envMap(vec3 p){

    p *= 3.;
    //p.xz += iTime*.5;

    float n3D2 = noise3D(p*3.);

    // A bit of fBm.
    float c = noise3D(p)*.57 + noise3D(p*2.)*.28 + noise3D(p*4.)*.15;
    c = smoothstep(.25, 1., c); // Putting in some dark space.

    p = vec3(c, c*c, c*c*c); // Bluish tinge.

    return mix(p, p.zyx, n3D2*.25 + .75); // Mixing in a bit of purple.

}


vec3 getObjectColor(vec3 p, vec3 n){


    //p.xy -= path(p.z);
    float sz0 = 1./2.;

    // Texel retrieval.
    vec3 txP = p;
    //txP.xz *= r2(getRndID(svVRnd)*6.2831);
    vec3 col = tex3D(iChannel0, txP*sz0, n );
    col = smoothstep(-.0, .5, col);//*vec3(.5, .8, 1.5);
    col = mix(col, vec3(1)*dot(col, vec3(.299, .587, .114)), .5);
    // Darken the surfaces to bring more attention to the neon lights.
    col /= 16.;


    // Unique random ID for the hexagon pylon.
    float rnd = getRndID(svV2Rnd);

    // Subtly coloring the unlit hexagons... I wasn't feeling it. :)
    //if(svLitID==1. && rnd<=.0) col *= vec3(1, .85, .75)*4.;

    // Applying the glow.
    //
    // It's took a while to hit upon the right combination. You can create a cheap lit object
    // effect by simply ramping up the object's color intensity. However, your eyes can tell that
    // it's lacking that volumetric haze. Volumetric haze is achievable via a volumetric appoach.
    // However, it's prone to patchiness. The solutionm, of course, is to combine the smoothness
    // of direct object coloring with a portion of the glow. That's what is happining here.

    // Object glow.
    float oGlow = 0.;

    // Color every lit object with a gradient based on its vertical positioning.
    if(rnd>0. && svLitID==1.) {

        float ht = hexHeight(svV2Rnd);
    	ht = floor(ht*4.99)/4./2. + .02;
        const float s = 1./4./2.*.5; // Four levels, plus the height is divided by two.

        oGlow = mix(1., 0., clamp((abs(p.y - (ht - s)))/s*3.*1., 0., 1.));
        oGlow = smoothstep(0., 1., oGlow*1.);
    }

    // Mix the object glow in with a small potion of the volumetric glow.
    glow = mix(glow, vec3(oGlow), .75);

    // Colorizing the glow, depending on your requirements. I've used a colorful orangey palette,
    // then have modified the single color according to a made up 3D transcental function.
    //glow = pow(vec3(1, 1.05, 1.1)*glow.x, vec3(6, 3, 1));
    glow = pow(vec3(1.5, 1, 1)*glow, vec3(1, 3, 6)); // Mild firey orange.
    glow = mix(glow, glow.xzy, dot(sin(p*4. - cos(p.yzx*4.)), vec3(.166)) + .5); // Mixing in some pink.
    glow = mix(glow, glow.zyx, dot(cos(p*2. - sin(p.yzx*2.)), vec3(.166)) + .5); // Blue tones.
    //glow = mix(glow.zyx, glow, smoothstep(-.1, .1, dot(sin(p + cos(p.yzx)), vec3(.166))));

    #ifdef GREEN_GLOW
    glow = glow.yxz;
    #endif


    return col;

}


// Using the hit point, unit direction ray, etc, to color the
// scene. Diffuse, specular, falloff, etc. It's all pretty
// standard stuff.
vec3 doColor(in vec3 sp, in vec3 rd, in vec3 sn, in vec3 lp, in float t){

    vec3 sceneCol = vec3(0);

    if(t<FAR){

           // Texture bump the normal.
    	float sz0 = 1./1.;
    	vec3 txP = sp;
        //txP.xy -= path(txP.z);
        //txP.xz *= r2(getRndID(svVRnd)*6.2831);
        sn = texBump(iChannel0, txP*sz0, sn, .005);///(1. + t/FAR)


        // Retrieving the normal at the hit point.
        //sn = getNormal(sp);
        float sh = softShadow(sp, lp, 12.);
        float ao = calcAO(sp, sn);
        sh = min(sh + ao*.3, 1.);

        vec3 ld = lp - sp; // Light direction vector.
        float lDist = max(length(ld), .001); // Light to surface distance.
        ld /= lDist; // Normalizing the light vector.

        // Attenuating the light, based on distance.
        float atten = 1.5/(1. + lDist*.1 + lDist*lDist*.02);

        // Standard diffuse term.
        float diff = max(dot(sn, ld), 0.);
        //if(svLitID == 0.) diff = pow(diff, 4.)*2.;
        // Standard specualr term.
        float spec = pow(max( dot( reflect(-ld, sn), -rd ), 0.0 ), 32.);
        float fres = clamp(1.0 + dot(rd, sn), 0.0, 1.0); // Fresnel reflection term.
        //float Schlick = pow( 1. - max(dot(rd, normalize(rd + ld)), 0.), 5.0);
        //float fre2 = mix(.5, 1., Schlick);  //F0 = .5.



        // Coloring the object. You could set it to a single color, to
        // make things simpler, if you wanted.
        vec3 objCol = getObjectColor(sp, sn);


        // Combining the above terms to produce the final scene color.
        sceneCol = objCol*(diff + vec3(1, .6, .3)*spec*4. + .5*ao + vec3(.3, .5, 1)*fres*fres*2.);

        // Fake environment mapping.
        sceneCol += pow(sceneCol, vec3(1.))*envMap(reflect(rd, sn))*4.;


        // Applying the shadows and ambient occlusion.
        sceneCol *= atten*sh*ao;

        // For whatever reason, I didn't want the shadows and such to effect the glow, so I layered
        // it over the top.
        sceneCol += (objCol*6. + 1.)*glow; //*(sh*.35 + .65);

        //sceneCol = vec3(sh);

    }




    // Return the color. Done once every pass... of which there are
    // only two, in this particular instance.
    return sceneCol;

}




void mainImage( out vec4 fragColor, in vec2 fragCoord ){

    // Screen coordinates.
	vec2 uv = (fragCoord - iResolution.xy*.5) / iResolution.y;


	// Camera Setup.
	//vec3 lookAt = vec3(0., 0.25, iTime*2.);  // "Look At" position.
	//vec3 camPos = lookAt + vec3(2., 1.5, -1.5); // Camera position, doubling as the ray origin.

	vec3 lk = vec3(0, 1.25, iTime*1.);  // "Look At" position.
	vec3 ro = lk + vec3(0, .175, -.25); // Camera position, doubling as the ray origin.


    // Light position. Set in the vicinity the ray origin.
    vec3 lp = ro + vec3(0, 1, 4); //4

	// Using the Z-value to perturb the XY-plane.
	// Sending the camera, "look at," and two light vectors down the tunnel. The "path" function is
	// synchronized with the distance function. Change to "path2" to traverse the other tunnel.
	lk.xy += path(lk.z);
	ro.xy += path(ro.z);
	lp.xy += path(lp.z);

    // Using the above to produce the unit ray-direction vector.
    float FOV = 3.14159/3.; // FOV - Field of view.
    vec3 forward = normalize(lk-ro);
    vec3 right = normalize(vec3(forward.z, 0., -forward.x ));
    vec3 up = cross(forward, right);

    // rd - Ray direction.
    vec3 rd = normalize(forward + FOV*uv.x*right + FOV*uv.y*up);

    // Camera lean.
    //rd.xy *= r2(path(lk.z).x/32.);
    /////////


    vec3 sceneColor, passColor, sn, sSn;



    // FIRST PASS.

    float t = trace(ro, rd);
    svV2Rnd = v2Rnd;
    svLitID = gLitID;


    //getGlow(ro, rd, t);

    // Fog based off of distance from the camera. Not used here.
    float fog = smoothstep(0., FAR-1., t);

    // Advancing the ray origin, "ro," to the new hit point.
    ro += rd*t;

    // Retrieving the normal at the hit point.
    //sn = getNormal(ro);
    //float edge = 0., crv = 1., ef = 5.;
	//sn = getNormal(ro, edge, crv, ef);//
    //sSn = sn; // Save the unpeturbed normal.
    sn = getNormal(ro);



    // Retrieving the color at the hit point, which is now "ro." I agree, reusing
    // the ray origin to describe the surface hit point is kind of confusing. The reason
    // we do it is because the reflective ray will begin from the hit point in the
    // direction of the reflected ray. Thus the new ray origin will be the hit point.
    // See "traceRef" below.
    passColor = doColor(ro, rd, sn, lp, t);
    sceneColor = passColor;//*(1. - edge*.8);//mix(passColor, vec3(0), fog); //



    // Shading. Shadows, ambient occlusion, etc. We're only performing this on the
    // first pass. Not accurate, but faster, and in most cases, not that noticeable.
    //float sh = softShadow(ro, lp, 12.);
    //sh *= calcAO(ro, sn);

/*
    // SECOND PASS - REFLECTED RAY

    // Standard reflected ray, which is just a reflection of the unit
    // direction ray off of the intersected surface. You use the normal
    // at the surface point to do that. Hopefully, it's common sense.
    rd = reflect(rd, normalize(sSn*.66 + sn*.34));




    // The reflected pass begins where the first ray ended, which is the suface
    // hit point, or in a few cases, beyond the far plane. By the way, for the sake
    // of simplicity, we'll perform a reflective pass for non hit points too. Kind
    // of wasteful, but not really noticeable. The direction of the new ray will
    // obviously be in the direction of the reflected ray. See just above.
    //
    // To anyone who's new to this, don't forgot to nudge the ray off of the
    // initial surface point. Otherwise, you'll intersect with the surface
    // you've just hit. After years of doing this, I still forget on occasion.
    t = traceRef(ro +  rd*.01, rd);
    svVRnd = vRnd;
    svObjID = objID;

    // Advancing the reflected ray origin, "ro," to the new hit point.
    ro += rd*t;

    // Retrieving the new normal at the reflected hit point.
    //sn = getNormal(ro);
    float edge2 = 0., crv2 = 1.;//, ef2 = 8.;
	sn = getNormal(ro, edge2, crv2, ef);//getNormal(sp);


    // Coloring the reflected hit point, then adding a portion of it to the final scene color.
    // How much you add depends on what you're trying to accomplish.
    passColor = doColor(ro, rd, sn, lp, t);
    sceneColor = sceneColor*.5 + passColor*(1. - edge2*.8);//mix(passColor, vec3(0), fog);

*/

    //sceneColor *= (1. - edge*.8);


    // APPLYING SHADOWS
    //
    // Multiply the shadow from the first pass by the final scene color. Ideally, you'd check to
    // see if the reflected point was in shadow, and incorporate that too, but we're cheating to
    // save cycles and skipping it. It's not really noticeable anyway. By the way, ambient
    // occlusion would make it a little nicer, but we're saving cycles and keeping things simple.
    //sceneColor *= sh;

    sceneColor = mix(sceneColor, vec3(0), fog);


    // Square vignette.
    uv = fragCoord/iResolution.xy;
    sceneColor = min(sceneColor, 1.)*pow( 16.*uv.x*uv.y*(1. - uv.x)*(1. - uv.y) , .0625);

    // Clamping the scene color, then presenting to the screen.
	fragColor = vec4(sqrt(clamp(sceneColor, 0.0, 1.0)), 1.0);
}


	`
