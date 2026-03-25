import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  Timestamp,
  getDocs
} from 'firebase/firestore';

export interface Application {
  id?: string;
  applicantName: string;
  serviceType: string;
  submittedDate: string;
  citizenId: string;
  documents: string[];
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  department: string;
  reviewNotes?: string;
  userId?: string;
  userEmail?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Create new application
export const createApplication = async (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...application,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating application:', error);
    return { success: false, error };
  }
};

// Update application status
export const updateApplicationStatus = async (applicationId: string, status: string, reviewNotes?: string) => {
  try {
    const appRef = doc(db, 'applications', applicationId);
    await updateDoc(appRef, {
      status,
      ...(reviewNotes && { reviewNotes }),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating application:', error);
    return { success: false, error };
  }
};

// Delete application
export const deleteApplication = async (applicationId: string) => {
  try {
    await deleteDoc(doc(db, 'applications', applicationId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting application:', error);
    return { success: false, error };
  }
};

// Real-time listener for applications
export const listenToApplications = (
  callback: (applications: Application[]) => void,
  userId?: string,
  userRole?: string,
  department?: string,
  statusFilter?: string
) => {
  let q;
  
  if (userRole === 'admin' || userRole === 'officer') {
    // Admin and Officer see all applications
    q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    
    if (department && department !== '') {
      q = query(q, where('department', '==', department));
    }
    
    if (statusFilter && statusFilter !== 'all' && statusFilter !== 'pending' && 
        statusFilter !== 'reviewed' && statusFilter !== 'approved' && statusFilter !== 'rejected') {
      q = query(q, where('status', '==', statusFilter));
    }
  } else {
    // Citizens see only their own applications
    if (userId) {
      q = query(
        collection(db, 'applications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    }
  }
  
  return onSnapshot(q, (snapshot) => {
    const applications: Application[] = [];
    snapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as Application);
    });
    callback(applications);
  });
};

// Get user role
export const getUserRole = async (userId: string) => {
  try {
    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', userId)));
    if (!userDoc.empty) {
      return userDoc.docs[0].data().role;
    }
    return 'citizen';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'citizen';
  }
};