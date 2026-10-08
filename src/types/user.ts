export type User = {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "customer" | "admin";
  created_at: string;
};
