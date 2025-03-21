import { useEffect, useRef, useState, useCallback } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { fightersData } from "../consts/globeData";

// Constantes globales
const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame
const DEFAULT_SIZE = 250; // Tamaño predeterminado reducido

// Mapeo interno de IDs (fighters.ts -> globeData.ts)
const idMapping: Record<string, string> = {
  peereira: "peereira7",
  perxitaa: "perxitaa",
  abby: "abby",
  roro: "roro",
  gaspi: "gaspi",
  rivaldios: "rivaldios",
  andoni: "andoni",
  viruzz: "viruzz",
  alana: "alana",
  grefg: "peereira7",
  westcol: "peereira7",
  arigeli: "ariGeli",
  tomas: "tomasMazza",
  carlos: "carlosBelcast",
};

// Hook simplificado para tamaño de ventana
function useWindowSize() {
  const [size, setSize] = useState({
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

interface CustomGlobeProps {
  selectedFighter: string;
}

const CustomGlobe = ({ selectedFighter }: CustomGlobeProps) => {
  // Convertir ID de fighters.ts a ID de globeData.ts
  const globeDataId = idMapping[selectedFighter];
  const globeData = fightersData[globeDataId];

  // Ref para el globo
  const globeEl = useRef<any>(null);
  // Ref para nubes
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  // Un solo estado para el cliente
  const [isReady, setIsReady] = useState(false);

  // Obtener tamaño de la ventana
  const { width } = useWindowSize();

  // Tamaño del globo optimizado
  const globeSize = isReady
    ? width < 768
      ? 180
      : width < 1024
      ? 200
      : 220
    : DEFAULT_SIZE;

  // Efecto único para inicializar
  useEffect(() => {
    // Esperar a que el DOM esté listo para evitar problemas
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !globeEl.current) return;

    const globe = globeEl.current;

    // Configurar controles de cámara
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minDistance = 101;
    controls.maxDistance = 500;

    // Posicionar la cámara
    if (globeData.cameraPosition) {
      globe.pointOfView(globeData.cameraPosition, 500);
    }

    // Crear nubes
    const createClouds = () => {
      if (cloudsRef.current) return;

      const CLOUDS_IMG_URL = "/textures/globe/clouds.png";

      new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
        if (!globe || !globe.scene) return;

        const scene = globe.scene();
        if (!scene) return;

        cloudsRef.current = new THREE.Mesh(
          new THREE.SphereGeometry(
            globe.getGlobeRadius() * (1 + CLOUDS_ALT),
            60,
            60
          ),
          new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.7,
          })
        );

        scene.add(cloudsRef.current);
      });
    };

    // Crear nubes
    createClouds();

    // Rotar nubes
    const rotateClouds = () => {
      if (cloudsRef.current && cloudsRef.current.rotation) {
        cloudsRef.current.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
      }
      return requestAnimationFrame(rotateClouds);
    };

    const rotationId = rotateClouds();

    // Limpieza al desmontar
    return () => {
      cancelAnimationFrame(rotationId);

      // Limpiar nubes
      if (cloudsRef.current && globe.scene) {
        const scene = globe.scene();
        if (scene) {
          scene.remove(cloudsRef.current);
          if (cloudsRef.current.geometry) cloudsRef.current.geometry.dispose();
          if (cloudsRef.current.material) {
            if (Array.isArray(cloudsRef.current.material)) {
              cloudsRef.current.material.forEach((m) => m.dispose());
            } else {
              cloudsRef.current.material.dispose();
            }
          }
        }
      }
    };
  }, [isReady, globeData]);

  // Si no hay datos, no mostrar nada
  if (!globeData) return null;

  return (
    <Globe
      ref={globeEl}
      animateIn={false}
      globeImageUrl="//unpkg.com/three-globe@2.24.5/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe@2.24.5/example/img/earth-topology.png"
      height={globeSize}
      width={globeSize}
      backgroundColor="rgba(0, 0, 0, 0)"
      pointsData={[globeData.point]}
      pointLat="lat"
      pointLng="lng"
      pointAltitude="altitude"
      pointRadius="radius"
      pointColor="color"
      pointResolution={10}
      pointsMerge={false}
      labelsData={[globeData.label]}
      labelLat="lat"
      labelLng="lng"
      labelAltitude="altitude"
      labelText="text"
      labelColor="color"
      labelSize="size"
      labelResolution={60}
      labelDotRadius={0.3}
      labelIncludeDot={true}
      hexPolygonsData={globeData.geoJson.features}
      hexPolygonResolution={2}
      hexPolygonMargin={0.2}
      hexPolygonUseDots={false}
      hexPolygonAltitude={0.01}
      hexPolygonColor={(feature: any) => {
        if (feature.properties.name === globeData.country) {
          return globeData.color;
        }
        return "rgba(200, 200, 200, 0.6)";
      }}
      hexPolygonLabel={(feature: any) => feature.properties.name}
      hexPolygonGeoJsonGeometry={(feature: any) => feature.geometry}
    />
  );
};

export default CustomGlobe;
