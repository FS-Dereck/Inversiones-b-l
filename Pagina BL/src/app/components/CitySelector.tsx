import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const hondurasCities = [
  "Tegucigalpa",
  "San Pedro Sula",
  "La Ceiba",
  "Choloma",
  "El Progreso",
  "Comayagua",
  "Puerto Cortés",
  "Choluteca",
  "Danlí",
  "Juticalpa",
  "Roatán",
  "Siguatepeque",
  "Tela",
  "Tocoa",
  "La Lima",
  "Villanueva",
  "Santa Rosa de Copán",
  "Olanchito",
  "Cofradía",
  "Potrerillos",
];

interface CitySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  id?: string;
}

export function CitySelector({ value, onValueChange, placeholder, id }: CitySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {hondurasCities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
