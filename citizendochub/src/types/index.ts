export type Language = 'en' | 'np';
export type UserType = 'citizen' | 'officer' | 'admin';

export type ServiceType = 'citizenship-certificate' | 'birth-certificate' | 'marriage-registration';
export type ApplicationStatus = 'submitted' | 'under-review' | 'approved' | 'rejected';

export interface Service {
  id: ServiceType;
  name: string;
  nameNp: string;
  description: string;
  descriptionNp: string;
  icon: string;
  processingTime: string;
  processingTimeNp: string;
  fee: number;
  feeNp: string;
}

export interface Application {
  id: string;
  applicationId: string;
  serviceType: ServiceType;
  status: ApplicationStatus;
  submittedDate: string;
}
 
export interface User {
  id: string;
  name: string;
  type: UserType;
}