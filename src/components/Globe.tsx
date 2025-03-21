import { useEffect, useRef, useState, useCallback } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { fightersData } from "../consts/globeData";

// Constantes globales
const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

interface CustomGlobeProps {
  selectedFighter: string;
}

const CustomGlobe = ({ selectedFighter = "peereira7" }: CustomGlobeProps) => {
  // Usar any para evitar problemas de tipado con el ref
  const globeEl = useRef<any>(null);
  const [fighterData, setFighterData] = useState(
    fightersData[selectedFighter] || Object.values(fightersData)[0]
  );
  // Referencia para el objeto de nubes
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  // Control para limpiar las nubes solo cuando sea necesario
  const [cloudsNeedUpdate, setCloudsNeedUpdate] = useState(true);

  // Preparar datos
  const prepareData = useCallback(() => {
    if (!fighterData) return;

    // Esta copia profunda es innecesaria si no modificamos los datos
    return fighterData;
  }, [fighterData]);

  // Datos corregidos
  const correctedFighterData = prepareData();

  // Limpiar las nubes para mostrar evitar el errores al moverse de peleador a peleador
  const cleanupClouds = useCallback(() => {
    if (globeEl.current && globeEl.current.scene && cloudsRef.current) {
      const scene = globeEl.current.scene();

      if (scene && cloudsRef.current) {
        scene.remove(cloudsRef.current);
        if (cloudsRef.current.geometry) {
          cloudsRef.current.geometry.dispose();
        }
        if (cloudsRef.current.material) {
          if (Array.isArray(cloudsRef.current.material)) {
            cloudsRef.current.material.forEach((m) => m.dispose());
          } else {
            cloudsRef.current.material.dispose();
          }
        }
        cloudsRef.current = null;
      }
    }
  }, []);

  // Actualizar los datos cuando cambia el peleador seleccionado
  useEffect(() => {
    // Verificar si el peleador existe, si no usar el primero de la lista
    const fighter =
      fightersData[selectedFighter] || Object.values(fightersData)[0];
    setFighterData(fighter);

    // Marcar las nubes para actualización solo si realmente cambiamos de peleador
    if (fighter !== fighterData) {
      setCloudsNeedUpdate(true);
    }
  }, [selectedFighter, fighterData]);

  // Manejar la posición de la cámara y las nubes
  useEffect(() => {
    const globe = globeEl.current;

    if (!globe || !correctedFighterData) return;

    // Auto-rotate (mantener configuración cuando ya existe)
    if (!globe.controls().autoRotate) {
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.35;
    }

    // Posicionar la cámara para el peleador seleccionado sin reiniciar la rotación
    if (correctedFighterData.cameraPosition) {
      globe.pointOfView(correctedFighterData.cameraPosition, 1500); // 1500ms de animación más suave
    }

    // Actualizar las nubes solo si es necesario
    if (cloudsNeedUpdate) {
      // Primero limpiar las nubes existentes
      cleanupClouds();

      // Add clouds sphere
      const CLOUDS_IMG_URL = "/textures/globe/clouds.png";

      new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
        if (!globe || !globe.scene) return;

        const scene = globe.scene();
        if (!scene) return;

        // Crear nuevas nubes
        cloudsRef.current = new THREE.Mesh(
          new THREE.SphereGeometry(
            globe.getGlobeRadius() * (1 + CLOUDS_ALT),
            75,
            75
          ),
          new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.8, // Ligera reducción de opacidad para mejorar visibilidad
          })
        );

        scene.add(cloudsRef.current);

        // Ya no necesitamos actualizar las nubes
        setCloudsNeedUpdate(false);
      });
    }

    // Función para rotar las nubes (independiente de la recreación)
    function rotateClouds() {
      if (cloudsRef.current && cloudsRef.current.rotation) {
        cloudsRef.current.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
      }
      requestAnimationFrame(rotateClouds);
    }

    // Siempre mantener la rotación de nubes activa
    const rotationId = requestAnimationFrame(rotateClouds);

    // Limpieza
    return () => {
      cancelAnimationFrame(rotationId);
    };
  }, [correctedFighterData, cloudsNeedUpdate, cleanupClouds]);

  // Si no hay datos del peleador, no renderizar nada
  if (!correctedFighterData) return null;

  return (
    <Globe
      ref={globeEl}
      animateIn={false}
      globeImageUrl="//unpkg.com/three-globe@2.24.5/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe@2.24.5/example/img/earth-topology.png"
      height={500}
      width={500}
      backgroundColor="rgba(0, 0, 0, 0)"
      // Configuración de los puntos
      pointsData={[correctedFighterData.point]}
      pointLat="lat"
      pointLng="lng"
      pointAltitude="altitude"
      pointRadius="radius"
      pointColor="color"
      pointResolution={12}
      pointsMerge={false}
      // Configuración de los labels
      labelsData={[correctedFighterData.label]}
      labelLat="lat"
      labelLng="lng"
      labelAltitude="altitude"
      labelText="text"
      labelColor="color"
      labelSize="size"
      labelResolution={90} // Mayor resolución para mejor renderizado de texto
      labelDotRadius={0.4} // Mejorar la visibilidad del punto
      labelIncludeDot={true}
      hexPolygonsData={correctedFighterData.geoJson.features}
      hexPolygonResolution={3}
      hexPolygonMargin={0.2}
      hexPolygonUseDots={false}
      hexPolygonAltitude={0.01}
      hexPolygonColor={(feature: any) => {
        if (feature.properties.name === correctedFighterData.country) {
          return correctedFighterData.color;
        }
        return "rgba(200, 200, 200, 0.7)"; // Color por defecto
      }}
      hexPolygonLabel={(feature: any) => {
        return feature.properties.name;
      }}
      hexPolygonGeoJsonGeometry={(feature: any) => feature.geometry}
    />
  );
};

export default CustomGlobe;
