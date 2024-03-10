// glsl comentado permite formatear el codigo de glsl si se tiene habilitada alguna extension
export const whiteNoise = /* glsl */`
			float rand2D(in vec2 co){
				return fract(sin(dot(co.xy + iTime / 13.0 ,vec2(12.9898,78.233))) * 43758.5453);
		}

		vec4 noise(vec2 st) {
				vec3 col =mix(iPrimary,iSecondary, rand2D(st));
				return vec4(col,1.0);
		}

		void mainImage( out vec4 fragColor, in vec2 fragCoord )
		{
				vec2 norm_fragCoord = fragCoord.xy / iResolution.xy;
				fragColor = noise(norm_fragCoord);
		}
	`
