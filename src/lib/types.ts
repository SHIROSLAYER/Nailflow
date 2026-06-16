export type Service = {
  id: string;
  name: string;
  price: number | null;
  duration_min: number;
};

export type Appointment = {
  id: string;
  client_id: string | null;
  client_name: string;
  client_phone: string | null;
  service_id: string | null;
  service_name: string | null;
  starts_at: string; // ISO
  duration_min: number;
  status: "agendado" | "concluido" | "cancelado";
  notes: string | null;
};

export type GalleryImage = {
  id: string;
  title: string | null;
  storage_path: string;
  public_url: string;
  sort: number;
};
