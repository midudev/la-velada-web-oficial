import { ball } from "./Ball"
import { RayMarching } from "./RayMarching"
import { basic } from "./basic"
import { flare } from "./flare"
import { mouseMove } from "./mouseMove"
import { smoke1 } from "./smoke1"
import { smoke2 } from "./smoke2"
import { smoke3 } from "./smoke3"
import { smoke4 } from "./smoke4"
import { whiteNoise } from "./whiteNoise"

const shaders: string[] = [smoke1, smoke2, smoke3, smoke4, mouseMove, ball, flare, RayMarching, whiteNoise, basic]
export default shaders

/* uniforms disponibles en los shaders
iTime 			float
iResolution float vec2
iMouse 			float vec2
iPrimary 		float vec3
iSecondary 	float vec3
iChannel0 	texture sampler
*/
