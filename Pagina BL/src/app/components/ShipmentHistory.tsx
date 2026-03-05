import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Package, MapPin, Calendar, TrendingUp, Trash2 } from "lucide-react";
import { useShipments } from "../context/ShipmentContext";

export function ShipmentHistory({ onBack, onViewShipment }: { onBack: () => void; onViewShipment: (id: string) => void }) {
  const { shipments, deleteShipment } = useShipments();

  const totalShipments = shipments.length;
  const totalAmount = shipments.reduce((sum, shipment) => sum + shipment.amount, 0);
  const deliveredCount = shipments.filter(s => s.status === "entregado").length;
  const inTransitCount = shipments.filter(s => s.status === "en_transito" || s.status === "recogido").length;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de que deseas eliminar este envío?")) {
      deleteShipment(id);
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

        <div className="space-y-4">
          <Card>
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={24} />
                Resumen de Envíos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{totalShipments}</p>
                  <p className="text-sm text-gray-600">Total Envíos</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Gastado</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-600">{inTransitCount}</p>
                  <p className="text-xs text-gray-600">En Proceso</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xl font-bold text-emerald-600">{deliveredCount}</p>
                  <p className="text-xs text-gray-600">Entregados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 px-1">Historial Completo</h3>
            {shipments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">No hay envíos registrados</p>
                  <p className="text-sm text-gray-500 mt-1">Crea tu primer envío para comenzar</p>
                </CardContent>
              </Card>
            ) : (
              shipments.map((shipment) => (
                <Card 
                  key={shipment.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onViewShipment(shipment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold">{shipment.id}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            {shipment.createdDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(shipment.id, e)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-600">{shipment.origin}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-600">{shipment.destination}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-500">
                        {shipment.weight} kg • {shipment.packageType === "express" ? "Express" : "Estándar"}
                      </span>
                      <span className="font-semibold text-blue-600">${shipment.amount.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}