export type Profile = {
  id: string;
  full_name: string;
  employee_id: string;
  role: { role_name: string }; 
  role_id: number;
  last_sign_in_at: string;
};

export type UserLog = {
  id: string;
  action: string;
  details: string | null;
  created_at: string;
};