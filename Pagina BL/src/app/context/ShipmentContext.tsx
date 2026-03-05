import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ShipmentHistory {
  status: string;
  date: string;
  location: string;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  packageType: string;
  amount: number;
  status: "pendiente" | "recogido" | "en_transito" | "entregado" | "cancelado";
  currentLocation: string;
  estimatedDelivery: string;
  createdDate: string;
  history: ShipmentHistory[];
  customerComment?: string;
  commentDate?: string;
}

interface ShipmentContextType {
  shipments: Shipment[];
  addShipment: (shipment: Omit<Shipment, "id" | "status" | "createdDate" | "history">) => string;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export function ShipmentProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem("bl-shipments");
    if (saved) {
      return JSON.parse(saved);
    }
    // Datos iniciales de ejemplo
    return [
      {
        id: "BL001234",
        origin: "Tegucigalpa",
        destination: "San Pedro Sula",
        weight: 25,
        packageType: "standard",
        amount: 450.00,
        status: "en_transito",
        currentLocation: "Comayagua",
        estimatedDelivery: "14 Feb 2026",
        createdDate: "10 Feb 2026",
        history: [
          { status: "Pedido creado", date: "10 Feb 2026 - 08:00", location: "Tegucigalpa" },
          { status: "Recogido", date: "10 Feb 2026 - 09:00", location: "Tegucigalpa" },
          { status: "En tránsito", date: "10 Feb 2026 - 14:30", location: "Comayagua" },
        ],
      },
      {
        id: "BL005678",
        origin: "La Ceiba",
        destination: "Puerto Cortés",
        weight: 40,
        packageType: "express",
        amount: 680.00,
        status: "entregado",
        currentLocation: "Puerto Cortés",
        estimatedDelivery: "09 Feb 2026",
        createdDate: "06 Feb 2026",
        history: [
          { status: "Pedido creado", date: "06 Feb 2026 - 07:00", location: "La Ceiba" },
          { status: "Recogido", date: "06 Feb 2026 - 08:00", location: "La Ceiba" },
          { status: "En tránsito", date: "07 Feb 2026 - 11:00", location: "El Progreso" },
          { status: "Entregado", date: "09 Feb 2026 - 15:45", location: "Puerto Cortés" },
        ],
      },
      {
        id: "BL003421",
        origin: "Choluteca",
        destination: "Roatán",
        weight: 30,
        packageType: "standard",
        amount: 520.00,
        status: "entregado",
        currentLocation: "Roatán",
        estimatedDelivery: "04 Feb 2026",
        createdDate: "02 Feb 2026",
        history: [
          { status: "Pedido creado", date: "02 Feb 2026 - 09:00", location: "Choluteca" },
          { status: "Recogido", date: "02 Feb 2026 - 10:30", location: "Choluteca" },
          { status: "En tránsito", date: "03 Feb 2026 - 08:00", location: "La Ceiba" },
          { status: "Entregado", date: "04 Feb 2026 - 16:20", location: "Roatán" },
        ],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("bl-shipments", JSON.stringify(shipments));
  }, [shipments]);

  const generateId = () => {
    const num = Math.floor(Math.random() * 999999).toString().padStart(6, "0");
    return `BL${num}`;
  };

  const calculateEstimatedDelivery = (packageType: string, createdDate: Date) => {
    const days = packageType === "express" ? 2 : 4;
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };

  const addShipment = (shipmentData: Omit<Shipment, "id" | "status" | "createdDate" | "history">) => {
    const id = generateId();
    const now = new Date();
    const createdDate = now.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
    const timeString = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    
    const newShipment: Shipment = {
      ...shipmentData,
      id,
      status: "pendiente",
      currentLocation: shipmentData.origin,
      estimatedDelivery: calculateEstimatedDelivery(shipmentData.packageType, now),
      createdDate,
      history: [
        {
          status: "Pedido creado",
          date: `${createdDate} - ${timeString}`,
          location: shipmentData.origin,
        },
      ],
    };

    setShipments((prev) => [newShipment, ...prev]);
    return id;
  };

  const updateShipment = (id: string, updates: Partial<Shipment>) => {
    setShipments((prev) =>
      prev.map((shipment) => {
        if (shipment.id === id) {
          return {
            ...shipment,
            ...updates,
          };
        }
        return shipment;
      })
    );
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        addShipment,
        updateShipment,
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  const context = useContext(ShipmentContext);
  if (context === undefined) {
    throw new Error("useShipments must be used within a ShipmentProvider");
  }
  return context;
}