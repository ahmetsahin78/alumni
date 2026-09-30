export interface AlumniMember {
  id: number;
  name: string;
  graduationYear: number;
  department?: string;
  company?: string;
  email?: string;
  role?: string;
}

export interface CreateAlumniDTO {
  name: string;
  graduationYear: number;
  department?: string;
  company?: string;
  email?: string;
  role?: string;
}

export interface UpdateAlumniDTO {
  name: string;
  graduationYear: number;
  department?: string;
  company?: string;
  email?: string;
  role?: string;
}

export interface PatchAlumniDTO {
  name?: string;
  graduationYear?: number;
  department?: string;
  company?: string;
  email?: string;
  role?: string;
}
