import { toast } from '../hooks/use-toast';

// Types for applications and notifications
export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  resumeUrl?: string;
  coverLetter?: string;
  jobTitle: string;
  company: string;
  postedBy: string; // Alumni/Admin who posted the job
}

export interface Notification {
  id: string;
  type: 'job_application' | 'new_job_posted' | 'application_status_update';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  relatedId: string; // Job ID or Application ID
  targetRole: 'student' | 'alumni' | 'admin' | 'all';
  fromUser?: {
    name: string;
    role: string;
  };
}

// Storage keys
const APPLICATIONS_STORAGE_KEY = 'referrify_job_applications';
const NOTIFICATIONS_STORAGE_KEY = 'referrify_notifications';
const APPLICATIONS_COOKIE_KEY = 'referrify_applications';
const NOTIFICATIONS_COOKIE_KEY = 'referrify_notifications';

// Helper functions for storage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
};

const getFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return [];
  }
};

const saveToCookie = (key: string, data: any) => {
  try {
    document.cookie = `${key}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=31536000`;
  } catch (error) {
    console.error(`Error saving to cookie:`, error);
  }
};

const getFromCookie = (key: string) => {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === key) {
        return JSON.parse(decodeURIComponent(value));
      }
    }
    return [];
  } catch (error) {
    console.error(`Error reading from cookie:`, error);
    return [];
  }
};

// Application management functions
export const submitJobApplication = (
  jobId: string,
  jobTitle: string,
  company: string,
  postedBy: string,
  studentData: {
    name: string;
    email: string;
    resumeUrl?: string;
    coverLetter?: string;
  }
): JobApplication => {
  const application: JobApplication = {
    id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    jobId,
    studentId: `student_${studentData.email}`,
    studentName: studentData.name,
    studentEmail: studentData.email,
    appliedAt: new Date().toISOString(),
    status: 'pending',
    resumeUrl: studentData.resumeUrl,
    coverLetter: studentData.coverLetter,
    jobTitle,
    company,
    postedBy
  };

  // Save application
  const applications = getApplications();
  applications.push(application);
  saveApplications(applications);

  // Create notifications for alumni and admin
  createNotification({
    type: 'job_application',
    title: 'New Job Application',
    message: `${studentData.name} applied for ${jobTitle} at ${company}`,
    relatedId: application.id,
    targetRole: 'alumni',
    fromUser: {
      name: studentData.name,
      role: 'Student'
    }
  });

  createNotification({
    type: 'job_application',
    title: 'New Job Application',
    message: `${studentData.name} applied for ${jobTitle} at ${company}`,
    relatedId: application.id,
    targetRole: 'admin',
    fromUser: {
      name: studentData.name,
      role: 'Student'
    }
  });

  toast({
    title: "Application Submitted!",
    description: `Your application for ${jobTitle} at ${company} has been submitted successfully.`,
  });

  return application;
};

export const getApplications = (): JobApplication[] => {
  const storageData = getFromStorage(APPLICATIONS_STORAGE_KEY);
  const cookieData = getFromCookie(APPLICATIONS_COOKIE_KEY);
  
  // Merge and deduplicate
  const allApplications = [...storageData, ...cookieData];
  const uniqueApplications = allApplications.filter((app, index, self) => 
    index === self.findIndex(a => a.id === app.id)
  );
  
  return uniqueApplications;
};

export const saveApplications = (applications: JobApplication[]) => {
  saveToStorage(APPLICATIONS_STORAGE_KEY, applications);
  saveToCookie(APPLICATIONS_COOKIE_KEY, applications);
};

export const getApplicationsByJobId = (jobId: string): JobApplication[] => {
  return getApplications().filter(app => app.jobId === jobId);
};

export const getApplicationsByPostedBy = (postedBy: string): JobApplication[] => {
  return getApplications().filter(app => app.postedBy === postedBy);
};

export const updateApplicationStatus = (
  applicationId: string, 
  status: JobApplication['status'],
  updatedBy: string
) => {
  const applications = getApplications();
  const applicationIndex = applications.findIndex(app => app.id === applicationId);
  
  if (applicationIndex !== -1) {
    const application = applications[applicationIndex];
    applications[applicationIndex] = { ...application, status };
    saveApplications(applications);

    // Notify student about status update
    createNotification({
      type: 'application_status_update',
      title: 'Application Status Updated',
      message: `Your application for ${application.jobTitle} has been ${status}`,
      relatedId: applicationId,
      targetRole: 'student',
      fromUser: {
        name: updatedBy,
        role: 'Alumni'
      }
    });

    toast({
      title: "Application Status Updated",
      description: `Application for ${application.jobTitle} marked as ${status}`,
    });
  }
};

// Notification management functions
export const createNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    isRead: false,
    ...notificationData
  };

  const notifications = getNotifications();
  notifications.unshift(notification); // Add to beginning for newest first
  saveNotifications(notifications);

  return notification;
};

export const getNotifications = (): Notification[] => {
  const storageData = getFromStorage(NOTIFICATIONS_STORAGE_KEY);
  const cookieData = getFromCookie(NOTIFICATIONS_COOKIE_KEY);
  
  // Merge and deduplicate
  const allNotifications = [...storageData, ...cookieData];
  const uniqueNotifications = allNotifications.filter((notif, index, self) => 
    index === self.findIndex(n => n.id === notif.id)
  );
  
  // Sort by createdAt descending (newest first)
  return uniqueNotifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const saveNotifications = (notifications: Notification[]) => {
  saveToStorage(NOTIFICATIONS_STORAGE_KEY, notifications);
  saveToCookie(NOTIFICATIONS_COOKIE_KEY, notifications);
};

export const getNotificationsByRole = (role: 'student' | 'alumni' | 'admin'): Notification[] => {
  return getNotifications().filter(notif => 
    notif.targetRole === role || notif.targetRole === 'all'
  );
};

export const markNotificationAsRead = (notificationId: string) => {
  const notifications = getNotifications();
  const notificationIndex = notifications.findIndex(notif => notif.id === notificationId);
  
  if (notificationIndex !== -1) {
    notifications[notificationIndex] = { 
      ...notifications[notificationIndex], 
      isRead: true 
    };
    saveNotifications(notifications);
  }
};

export const markAllNotificationsAsRead = (role: 'student' | 'alumni' | 'admin') => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notif => 
    (notif.targetRole === role || notif.targetRole === 'all') && !notif.isRead
      ? { ...notif, isRead: true }
      : notif
  );
  saveNotifications(updatedNotifications);
};

export const getUnreadNotificationCount = (role: 'student' | 'alumni' | 'admin'): number => {
  return getNotificationsByRole(role).filter(notif => !notif.isRead).length;
};

// Job posting notification (when alumni adds job)
export const notifyJobPosted = (jobTitle: string, company: string, postedBy: string) => {
  createNotification({
    type: 'new_job_posted',
    title: 'New Job Opportunity',
    message: `New ${jobTitle} position at ${company}`,
    relatedId: `job_${Date.now()}`,
    targetRole: 'student',
    fromUser: {
      name: postedBy,
      role: 'Alumni'
    }
  });

  createNotification({
    type: 'new_job_posted',
    title: 'New Job Posted by Alumni',
    message: `${postedBy} posted ${jobTitle} at ${company}`,
    relatedId: `job_${Date.now()}`,
    targetRole: 'admin',
    fromUser: {
      name: postedBy,
      role: 'Alumni'
    }
  });
};

// Helper function to get application statistics
export const getApplicationStats = () => {
  const applications = getApplications();
  return {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };
};