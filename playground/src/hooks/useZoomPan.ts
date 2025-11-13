import { useState, useCallback, useRef, useEffect } from "react";

export function useZoomPan(containerRef: React.RefObject<HTMLDivElement>) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(5, z + 0.25));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.1, z - 0.25));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((z) => Math.max(0.1, Math.min(5, z + delta)));
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsPanning(true);
        startXRef.current = e.clientX - panX;
        startYRef.current = e.clientY - panY;
        container.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setPanX(e.clientX - startXRef.current);
        setPanY(e.clientY - startYRef.current);
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        container.style.cursor = "grab";
      }
    };

    const handleMouseLeave = () => {
      if (isPanning) {
        setIsPanning(false);
        container.style.cursor = "grab";
      }
    };

    container.addEventListener("wheel", handleWheel);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, isPanning, panX, panY]);

  return {
    zoom,
    panX,
    panY,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}

