/**
 * Doctor types
 */

export interface DoctorService {
  id: number;
  name: string;
  description: string;
  durationMins: string;
}

export interface Doctor {
  id: number;
  name: string;
  officeRoom: string;
  services: DoctorService[];
}

export interface RawDoctor {
  id: number;
  name: string;
  officeRoom: string;
  services: DoctorService[];
}
