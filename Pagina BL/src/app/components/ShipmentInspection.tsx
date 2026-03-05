import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Camera, Package, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useShipments } from "../context/ShipmentContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ShipmentInspection({ onBack }: { onBack: () => void }) {
  const { shipments, updateShipment } = useShipments();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [currentShipment, setCurrentShipment] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSearch = () => {
    const shipment = shipments.find((s) => s.id === trackingNumber.toUpperCase());
    if (shipment) {
      setCurrentShipment(shipment);
      setComment(shipment.customerComment || "");
      setSaved(false);
    } else {
      setCurrentShipment(null);
      alert("Número de guía no encontrado");
    }
  };

  const handleSaveComment = () => {
    if (currentShipment) {
      updateShipment(currentShipment.id, {
        customerComment: comment,
        commentDate: new Date().toLocaleString("es-HN"),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // Fotos de ejemplo de paquetes (simuladas)
  const packagePhotos = currentShipment
    ? [
        {
          id: 1,
          title: "Recepción en origen",
          date: currentShipment.createdDate,
          location: currentShipment.origin,
        },
        {
          id: 2,
          title: "Camión cargado",
          date: currentShipment.history?.[1]?.date || currentShipment.createdDate,
          location: currentShipment.origin,
        },
        {
          id: 3,
          title: "En tránsito",
          date: currentShipment.history?.[2]?.date || currentShipment.createdDate,
          location: currentShipment.currentLocation,
        },
        ...(currentShipment.status === "entregado"
          ? [
              {
                id: 4,
                title: "Entregado",
                date: currentShipment.history?.[currentShipment.history.length - 1]?.date || "",
                location: currentShipment.destination,
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-6 pb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Volver
        </Button>

        <Card className="mb-6">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Camera size={24} />
              Registro de Inspección
            </CardTitle>
            <p className="text-sm text-blue-100 mt-1">
              Consulta fotos y agrega observaciones sobre tu envío
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tracking">Número de Guía</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking"
                    placeholder="Ej: BL001234"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    className="font-mono"
                  />
                  <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                    Buscar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentShipment && (
          <>
            {/* Shipment Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-mono font-semibold">{currentShipment.id}</p>
                    <p className="text-sm text-gray-600">
                      {currentShipment.origin} → {currentShipment.destination}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Peso</p>
                    <p className="font-medium">{currentShipment.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estado</p>
                    <p className="font-medium capitalize">
                      {currentShipment.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon size={20} />
                  Fotografías del Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packagePhotos.map((photo, index) => (
                    <div key={photo.id} className="border rounded-lg overflow-hidden">
                      <div className="relative h-48 bg-gray-100">
                        <ImageWithFallback
                          src={
                            index === 0
                              ? "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdlJTIwYm94JTIwd2FyZWhvdXNlfGVufDF8fHx8MTc3MDczNTgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                              : index === 1
                              ? "https://images.unsplash.com/photo-1762381294795-8fa0e7f3e90c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbG9hZGVkJTIwcGFja2FnZXMlMjBjYXJnb3xlbnwxfHx8fDE3NzIyMTkwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                              : index === 2
                              ? "https://images.unsplash.com/photo-1605732562742-3023a888e56c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbG9hZGluZ3xlbnwxfHx8fDE3NzA3MzU4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                              : "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMG1hbiUyMHBhY2thZ2V8ZW58MXx8fHwxNzcwNzM1ODMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          }
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
                          Foto {photo.id}
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="font-medium text-sm">{photo.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <span>📍 {photo.location}</span>
                          <span>•</span>
                          <span>📅 {photo.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle size={20} />
                  Observaciones del Cliente
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Agrega comentarios sobre el estado del paquete
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comment">Comentario</Label>
                    <Textarea
                      id="comment"
                      placeholder="Ej: El paquete tenía un rayón en la esquina superior derecha..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Documenta cualquier daño, irregularidad o nota importante
                    </p>
                  </div>

                  {currentShipment.customerComment && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        Comentario guardado:
                      </p>
                      <p className="text-sm text-gray-700">
                        {currentShipment.customerComment}
                      </p>
                      {currentShipment.commentDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          {currentShipment.commentDate}
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleSaveComment}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!comment.trim()}
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 size={16} className="mr-2" />
                        Guardado
                      </>
                    ) : (
                      "Guardar Observación"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Documentación Importante
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Tus comentarios quedan registrados y serán revisados por nuestro
                      equipo. Si reportas daños, un agente se comunicará contigo en las
                      próximas 24 horas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!currentShipment && trackingNumber && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <Package size={48} className="mx-auto text-red-300 mb-3" />
              <p className="text-red-700 font-medium">Envío no encontrado</p>
              <p className="text-sm text-red-600 mt-1">
                Verifica el número de guía e intenta nuevamente
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}