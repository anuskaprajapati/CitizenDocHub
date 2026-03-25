import { useState, useEffect } from 'react';
import { 
  listenToApplications, 
  createApplication, 
  updateApplicationStatus, 
  deleteApplication 
} from '../firebase/services';
import type { Application } from '../firebase/services';

export const useFirebaseApplications = (
  userId?: string,
  userRole?: string,
  department?: string,
  statusFilter?: string
) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch if no userId and not officer/admin
    if (!userId && userRole !== 'officer' && userRole !== 'admin') {
      setLoading(false);
      return;
    }

    // Set up real-time listener
    const unsubscribe = listenToApplications(
      (apps) => {
        setApplications(apps);
        setLoading(false);
      },
      userId,
      userRole,
      department,
      statusFilter
    );

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, userRole, department, statusFilter]);

  const addApplication = async (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await createApplication(application);
  };

  const updateStatus = async (applicationId: string, status: string, notes?: string) => {
    return await updateApplicationStatus(applicationId, status, notes);
  };

  const removeApplication = async (applicationId: string) => {
    return await deleteApplication(applicationId);
  };

  return {
    applications,
    loading,
    addApplication,
    updateStatus,
    removeApplication
  };
};