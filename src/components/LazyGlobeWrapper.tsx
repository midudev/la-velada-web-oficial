import React, { lazy, Suspense } from "react";

// Importar el componente Globe de forma diferida
// Eliminamos el timeout artificial ya que ahora controlamos la visibilidad desde el contenedor
const LazyGlobe = lazy(() => import("./Globe"));

// Componente de carga mientras se carga el globo
const LoadingFallback = () => (
  <div
    style={{
      width: "250px",
      height: "250px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  />
);

interface LazyGlobeWrapperProps {
  selectedFighter: string;
}

const LazyGlobeWrapper: React.FC<LazyGlobeWrapperProps> = ({
  selectedFighter,
}) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyGlobe selectedFighter={selectedFighter} />
    </Suspense>
  );
};

export default LazyGlobeWrapper;
