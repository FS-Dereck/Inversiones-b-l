import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Package, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { useShipments } from "../context/ShipmentContext";
import { CitySelector } from "./CitySelector";

export function QuoteShipment({ onBack, onShipmentCreated }: { onBack: () => void; onShipmentCreated?: (id: string) => void }) {
  const { addShipment } = useShipments();
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    packageType: "",
  });
  const [quote, setQuote] = useState<number | null>(null);
  const [createdShipmentId, setCreatedShipmentId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cálculo simulado del costo en Lempiras
    const baseRate = 100;
    const weightRate = parseFloat(formData.weight) * 5;
    const typeMultiplier = formData.packageType === "express" ? 1.5 : 1;
    const calculatedQuote = (baseRate + weightRate) * typeMultiplier;
    setQuote(calculatedQuote);
    setCreatedShipmentId(null);
  };

  const handleConfirmShipment = () => {
    if (!quote) return;

    const id = addShipment({
      origin: formData.origin,
      destination: formData.destination,
      weight: parseFloat(formData.weight),
      packageType: formData.packageType,
      amount: quote,
    });

    setCreatedShipmentId(id);
    
    // Resetear formulario después de 3 segundos y volver
    setTimeout(() => {
      if (onShipmentCreated) {
        onShipmentCreated(id);
      }
      setFormData({ origin: "", destination: "", weight: "", packageType: "" });
      setQuote(null);
      setCreatedShipmentId(null);
      onBack();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          ← Volver
        </Button>

        {createdShipmentId ? (
          <Card className="border-green-200">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">¡Envío Creado!</h2>
              <p className="text-gray-600 mb-4">Tu número de guía es:</p>
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <p className="text-3xl font-mono font-bold text-blue-600">{createdShipmentId}</p>
              </div>
              <p className="text-sm text-gray-500">
                Usa este número para rastrear tu envío
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Package size={24} />
                Cotizar Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="origin">Origen</Label>
                  <CitySelector
                    id="origin"
                    placeholder="Selecciona ciudad de origen"
                    value={formData.origin}
                    onValueChange={(value) =>
                      setFormData({ ...formData, origin: value })
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="text-blue-600" />
                </div>

                <div>
                  <Label htmlFor="destination">Destino</Label>
                  <CitySelector
                    id="destination"
                    placeholder="Selecciona ciudad de destino"
                    value={formData.destination}
                    onValueChange={(value) =>
                      setFormData({ ...formData, destination: value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ej: 25"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="packageType">Tipo de Servicio</Label>
                  <Select
                    value={formData.packageType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, packageType: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Estándar (3-5 días)</SelectItem>
                      <SelectItem value="express">Express (1-2 días)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Calcular Cotización
                </Button>
              </form>

              {quote && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Costo estimado:</p>
                    <p className="text-3xl text-green-700 font-bold">
                      ${quote.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      *Precio sujeto a confirmación
                    </p>
                  </div>
                  <Button
                    onClick={handleConfirmShipment}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Confirmar y Crear Envío
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}