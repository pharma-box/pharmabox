import { UserJSON } from '@clerk/backend-core'

export enum Role {
  Staff = 'staff',
  Patient = 'patient'
}

export enum StaffRootPages {
  Home = '/',
  Workflows = '/workflows',
  Patients = '/patients',
  Team = '/team',
  Logbook = '/logbook',
  Settings = '/settings/[[...index]]',
  Profile = '/settings/profile/[[...index]]'
}

export enum PatientRootPages {
  Home = '/',
  Payments = '/payments',
  Notifications = '/notifications',
  Settings = '/settings/[[...index]]',
  Profile = '/settings/profile/[[...index]]'
}

export type User = {
  id: string
  firstName: string | undefined
  lastName: string | undefined
  email: string
  phone?: string
  pickup_enabled?: boolean
  role?: Role
  createdAt: string
  updatedAt: string
}

export interface ServerPageProps {
  user: User
  __clerk_ssr_state: UserJSON
}
