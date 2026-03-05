import { MapPin, Navigation } from "lucide-react";

interface TrackingMapProps {
  origin: string;
  destination: string;
  currentLocation: string;
  status: string;
}

export function TrackingMap({ origin, destination, currentLocation, status }: TrackingMapProps) {
  // Calcular el progreso basado en el estado
  const getProgress = () => {
    switch (status) {
      case "pendiente":
        return 0;
      case "recogido":
        return 25;
      case "en_transito":
        return 60;
      case "entregado":
        return 100;
      default:
        return 0;
    }
  };

  const progress = getProgress();

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 overflow-hidden">
      {/* Fondo de mapa estilizado */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Ruta del envío */}
      <div className="relative">
        {/* Línea de progreso */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>

          {/* Punto de origen */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              progress >= 0 ? "bg-blue-600" : "bg-gray-300"
            }`}>
              <MapPin className="text-white" size={24} />
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-gray-700">Origen</p>
              <p className="text-xs text-gray-600 max-w-[80px] truncate">{origin}</p>
            </div>
          </div>

          {/* Punto actual (camión en movimiento) */}
          {progress > 0 && progress < 100 && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 z-10"
              style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg animate-bounce">
                  <Navigation className="text-white" size={24} />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className="text-xs font-medium text-gray-700">En camino</p>
                  <p className="text-xs text-gray-600">{currentLocation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Punto de destino */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              progress === 100 ? "bg-green-600" : "bg-gray-300"
            }`}>
              <MapPin className="text-white" size={24} />
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-gray-700">Destino</p>
              <p className="text-xs text-gray-600 max-w-[80px] truncate">{destination}</p>
            </div>
          </div>
        </div>

        {/* Información de ubicación actual */}
        <div className="mt-12 p-4 bg-white/80 backdrop-blur rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Navigation size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Ubicación actual</p>
              <p className="text-lg font-semibold text-blue-600">{currentLocation}</p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Progreso del viaje</span>
              <span className="text-xs font-medium text-blue-600">{progress}%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Decoración de puntos en el mapa */}
        <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400 rounded-full opacity-50"></div>
        <div className="absolute bottom-8 right-12 w-2 h-2 bg-green-400 rounded-full opacity-50"></div>
        <div className="absolute top-12 right-8 w-2 h-2 bg-yellow-400 rounded-full opacity-50"></div>
      </div>
    </div>
  );
}
