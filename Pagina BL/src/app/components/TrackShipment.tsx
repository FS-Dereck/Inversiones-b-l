import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Search, MapPin, Truck, CheckCircle2, Package, AlertCircle } from "lucide-react";
import { useShipments } from "../context/ShipmentContext";
import { TrackingMap } from "./TrackingMap";

export function TrackShipment({ onBack, initialTrackingNumber }: { onBack: () => void; initialTrackingNumber?: string }) {
  const { getShipment } = useShipments();
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || "");
  const [shipment, setShipment] = useState(() => 
    initialTrackingNumber ? getShipment(initialTrackingNumber) : null
  );
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getShipment(trackingNumber);
    if (found) {
      setShipment(found);
      setNotFound(false);
    } else {
      setShipment(null);
      setNotFound(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-6 pb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          ← Volver
        </Button>

        <Card>
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Search size={24} />
              Rastrear Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Input
                  placeholder="Ingresa tu número de guía"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  className="text-center font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Ej: BL001234
                </p>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>

            {notFound && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <div>
                  <p className="text-red-700 font-medium">Envío no encontrado</p>
                  <p className="text-sm text-red-600 mt-1">Verifica el número de guía e intenta nuevamente.</p>
                </div>
              </div>
            )}

            {shipment && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Número de guía:</span>
                    <span className="font-mono font-semibold">{shipment.id}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Estado:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      shipment.status === "entregado"
                        ? "bg-green-100 text-green-700"
                        : shipment.status === "en_transito"
                        ? "bg-blue-100 text-blue-700"
                        : shipment.status === "recogido"
                        ? "bg-yellow-100 text-yellow-700"
                        : shipment.status === "cancelado"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {shipment.status === "entregado" ? "Entregado" : 
                       shipment.status === "en_transito" ? "En tránsito" :
                       shipment.status === "recogido" ? "Recogido" :
                       shipment.status === "cancelado" ? "Cancelado" :
                       "Pendiente"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Entrega estimada:</span>
                    <span className="font-medium">{shipment.estimatedDelivery}</span>
                  </div>
                </div>

                {/* Mapa de rastreo */}
                <TrackingMap
                  origin={shipment.origin}
                  destination={shipment.destination}
                  currentLocation={shipment.currentLocation}
                  status={shipment.status}
                />

                <div className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Origen</p>
                      <p className="font-medium">{shipment.origin}</p>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Destino</p>
                      <p className="font-medium">{shipment.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-600">Peso: {shipment.weight} kg</span>
                    <span className="text-sm text-gray-600">
                      {shipment.packageType === "express" ? "Express" : "Estándar"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin size={18} className="text-blue-600" />
                    Historial de Rastreo
                  </h3>
                  <div className="space-y-3">
                    {shipment.history.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`rounded-full p-2 ${
                            event.status.includes("Entregado")
                              ? "bg-green-100"
                              : event.status.includes("tránsito")
                              ? "bg-blue-100"
                              : event.status.includes("Recogido")
                              ? "bg-yellow-100"
                              : "bg-gray-100"
                          }`}>
                            {event.status.includes("Entregado") ? (
                              <CheckCircle2 size={16} className="text-green-600" />
                            ) : event.status.includes("tránsito") ? (
                              <Truck size={16} className="text-blue-600" />
                            ) : (
                              <Package size={16} className="text-gray-600" />
                            )}
                          </div>
                          {index < shipment.history.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-xs text-gray-500">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}