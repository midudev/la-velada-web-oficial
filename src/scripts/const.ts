export const vertexGeom = [-1, -1, 1, -1, -1, 1, 1, 1]
export const indexGeom = [0, 1, 2, 3]
export const unifType = {
	fv1: 1,
	fv2: 2,
	fv3: 3,
	fv4: 4,
	color: 4,
	fv1i: 5,
}
// el logo esta a 1024*1024 pero su aspect ratio es 3333 2829

export const shaderImages = [
	[], // smoke1
	[], // smoke2
	[], // smoke3
	[], // smoke4
	[{ url: "Noise1.png", channel: 0 }], // mouseMove
	[], // ball
	[], // flare
	[{ url: "RustedMetal.jpg", channel: 2 }], // RayMarching
	[], // whiteNoise
	[], // basic
]

// base vertex shader
/*
	la etapa de vertex shader es programble es decir durante esta estapa se pueden
	modificar las posiciond de los vertices en el espacio defino de esta forma es posible
	hacer los calculos de transformacion en la gpu. el problema es que en la fase anterior
	no programable se hace el culling (descartar triangulos fuera del viewport)
*/

export const vsSource = (vertexDef: string) => `#version 300 es

	in vec4 a_position;
	out vec2 fragCoord;
	out vec2 v_textCoord;

	void main() {
		gl_Position  = vec4(a_position.xy, 0.0, 1.0); 
		v_textCoord=a_position.xy;
		${vertexDef}
	}
`

// Fragment shader template
/*
	en el fragment shader es donde se dibuja cada texel, la gpu no pinta pixeles sino texels se puede asignar una
		resolucion mayor a la nativa (supersampling) o menos a la nativa (subsampling) y la gpu para calcular el valor del pixel
		promediara el color y la opacidad.
*/
export const fsSource = (fragmentDef: string) => `#version 300 es

precision mediump float;
in vec2 v_textCoord;
out vec4 fragColor;

uniform float iTime;
uniform int iFrame;
uniform float iScroll;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform vec3 iPrimary;
uniform vec3 iSecondary;
uniform vec4 logoBox;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

${fragmentDef}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
  `
