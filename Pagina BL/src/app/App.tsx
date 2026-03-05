import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { QuoteShipment } from "./components/QuoteShipment";
import { TrackShipment } from "./components/TrackShipment";
import { ShipmentHistory } from "./components/ShipmentHistory";
import { ShipmentInspection } from "./components/ShipmentInspection";
import { ShipmentProvider, useShipments } from "./context/ShipmentContext";
import { Package, Search, Clock, Truck, Phone, Mail, MapPin, Camera } from "lucide-react";

type Screen = "home" | "quote" | "track" | "history" | "inspection";

function AppContent() {
  const { shipments } = useShipments();
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState<string | undefined>();

  const handleShipmentCreated = (id: string) => {
    setSelectedTrackingNumber(id);
    setCurrentScreen("track");
  };

  const handleViewShipment = (id: string) => {
    setSelectedTrackingNumber(id);
    setCurrentScreen("track");
  };

  if (currentScreen === "inspection") {
    return <ShipmentInspection onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "quote") {
    return <QuoteShipment onBack={() => setCurrentScreen("home")} onShipmentCreated={handleShipmentCreated} />;
  }

  if (currentScreen === "track") {
    return (
      <TrackShipment 
        onBack={() => {
          setCurrentScreen("home");
          setSelectedTrackingNumber(undefined);
        }} 
        initialTrackingNumber={selectedTrackingNumber}
      />
    );
  }

  if (currentScreen === "history") {
    return <ShipmentHistory onBack={() => setCurrentScreen("home")} onViewShipment={handleViewShipment} />;
  }

  // Get recent shipments for home screen
  const recentShipments = shipments.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={32} />
            <h1 className="text-2xl">Inversiones B/L</h1>
          </div>
          <p className="text-blue-100 text-sm">Tu socio de confianza en logística</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 -mt-16 relative z-10 pb-8">
        {/* Hero Image Card */}
        <Card className="mb-6 overflow-hidden shadow-lg">
          <div className="relative h-48">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1761243962976-6ab07278ed98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwaGlnaHdheXxlbnwxfHx8fDE3NzA2NDUyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Camión de fletes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm opacity-90">Envíos seguros y confiables</p>
              <p className="font-semibold">A todo el país</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentScreen("quote")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-3">
                <Package size={28} className="text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Cotizar</h3>
              <p className="text-xs text-gray-600">Calcula el costo de tu envío</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedTrackingNumber(undefined);
              setCurrentScreen("track");
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-4 bg-green-100 rounded-full mb-3">
                <Search size={28} className="text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Rastrear</h3>
              <p className="text-xs text-gray-600">Sigue tu envío en tiempo real</p>
            </CardContent>
          </Card>
        </div>

        {/* Register Button */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Camera size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Registro de Inspección</h3>
                  <p className="text-xs text-gray-600">Ver fotos y agregar observaciones</p>
                </div>
              </div>
              <Button
                onClick={() => setCurrentScreen("inspection")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Registro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-blue-600" />
                <h3 className="font-semibold">Mis Envíos</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentScreen("history")}
              >
                Ver todo →
              </Button>
            </div>
            {recentShipments.length === 0 ? (
              <div className="text-center py-6">
                <Package size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600 text-sm">No hay envíos recientes</p>
                <p className="text-xs text-gray-500 mt-1">Crea tu primer envío ahora</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentShipments.map((shipment) => (
                  <div 
                    key={shipment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleViewShipment(shipment.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${
                        shipment.status === "entregado" ? "bg-green-100" : 
                        shipment.status === "en_transito" ? "bg-blue-100" :
                        shipment.status === "recogido" ? "bg-yellow-100" : "bg-gray-100"
                      }`}>
                        <Package size={16} className={
                          shipment.status === "entregado" ? "text-green-600" : 
                          shipment.status === "en_transito" ? "text-blue-600" :
                          shipment.status === "recogido" ? "text-yellow-600" : "text-gray-600"
                        } />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-mono">{shipment.id}</p>
                        <p className="text-xs text-gray-600">{shipment.origin} → {shipment.destination}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      shipment.status === "entregado" ? "bg-green-100 text-green-700" :
                      shipment.status === "en_transito" ? "bg-blue-100 text-blue-700" :
                      shipment.status === "recogido" ? "bg-yellow-100 text-yellow-700" :
                      shipment.status === "cancelado" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {shipment.status === "entregado" ? "Entregado" : 
                       shipment.status === "en_transito" ? "En tránsito" :
                       shipment.status === "recogido" ? "Recogido" :
                       shipment.status === "cancelado" ? "Cancelado" :
                       "Pendiente"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Nuestros Servicios</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1573552991725-c7b115591d04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2UlMjBib3hlc3xlbnwxfHx8fDE3NzA3MzUyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Almacenamiento"
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <p className="text-sm font-medium">Almacenamiento</p>
                <p className="text-xs text-gray-600">Espacios seguros</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1663672025510-9820760c825e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXBwaW5nJTIwY29udGFpbmVyfGVufDF8fHx8MTc3MDczNTIxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Carga completa"
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <p className="text-sm font-medium">Carga Completa</p>
                <p className="text-xs text-gray-600">Envíos grandes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Phone size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-gray-600">+504 2234-5678</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Mail size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">contacto@inversionesbl.hn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MapPin size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-gray-600">Blvd. Morazán, Tegucigalpa</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <p className="text-sm mb-1">© 2026 Inversiones B/L</p>
          <p className="text-xs text-gray-400">Soluciones de transporte y logística</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ShipmentProvider>
      <AppContent />
    </ShipmentProvider>
  );
}

export default App;