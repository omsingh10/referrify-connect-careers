import { toast } from '@/hooks/use-toast';
import { notifyJobPosted } from './notification-system';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  applicationDeadline: string;
  postedBy: {
    name: string;
    email: string;
    role: 'Admin' | 'Alumni';
  };
  status: 'Active' | 'Closed' | 'Draft';
  createdAt: string;
  updatedAt: string;
  applicationsCount: number;
  viewsCount: number;
}

const JOBS_STORAGE_KEY = 'referrify_jobs';

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 30) => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

const getCookie = (name: string): string | null => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

// Job storage functions
export const saveJobs = (jobs: Job[]): void => {
  try {
    const jobsJson = JSON.stringify(jobs);
    
    // Save to localStorage
    localStorage.setItem(JOBS_STORAGE_KEY, jobsJson);
    
    // Save to cookies as backup
    setCookie(JOBS_STORAGE_KEY, jobsJson, 30);
    
  } catch (error) {
    console.error('Error saving jobs:', error);
    toast({
      title: "Storage Error",
      description: "Failed to save job data. Changes may not persist.",
      variant: "destructive",
    });
  }
};

export const getJobs = (): Job[] => {
  try {
    // Try localStorage first
    let jobsJson = localStorage.getItem(JOBS_STORAGE_KEY);
    
    // Fallback to cookies if localStorage fails
    if (!jobsJson) {
      jobsJson = getCookie(JOBS_STORAGE_KEY);
    }
    
    if (jobsJson) {
      return JSON.parse(jobsJson);
    }
    
    // Return default jobs if no data found
    return getDefaultJobs();
  } catch (error) {
    console.error('Error loading jobs:', error);
    toast({
      title: "Loading Error",
      description: "Failed to load job data. Showing default jobs.",
      variant: "destructive",
    });
    return getDefaultJobs();
  }
};

export const addJob = (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicationsCount' | 'viewsCount'>): Job => {
  try {
    const newJob: Job = {
      ...job,
      id: generateJobId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationsCount: 0,
      viewsCount: 0
    };
    
    const jobs = getJobs();
    jobs.unshift(newJob); // Add to beginning of array
    saveJobs(jobs);
    
    // Send notifications to students and admin about new job posting
    notifyJobPosted(job.title, job.company, job.postedBy.name);
    
    toast({
      title: "Job Added",
      description: `${job.title} at ${job.company} has been posted successfully.`,
    });
    
    return newJob;
  } catch (error) {
    console.error('Error adding job:', error);
    toast({
      title: "Error",
      description: "Failed to add job. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateJob = (id: string, updates: Partial<Job>): Job | null => {
  try {
    const jobs = getJobs();
    const jobIndex = jobs.findIndex(job => job.id === id);
    
    if (jobIndex === -1) {
      toast({
        title: "Error",
        description: "Job not found.",
        variant: "destructive",
      });
      return null;
    }
    
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    saveJobs(jobs);
    
    toast({
      title: "Job Updated",
      description: "Job details have been updated successfully.",
    });
    
    return jobs[jobIndex];
  } catch (error) {
    console.error('Error updating job:', error);
    toast({
      title: "Error",
      description: "Failed to update job. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteJob = (id: string): boolean => {
  try {
    const jobs = getJobs();
    const filteredJobs = jobs.filter(job => job.id !== id);
    
    if (filteredJobs.length === jobs.length) {
      toast({
        title: "Error",
        description: "Job not found.",
        variant: "destructive",
      });
      return false;
    }
    
    saveJobs(filteredJobs);
    
    toast({
      title: "Job Deleted",
      description: "Job has been removed successfully.",
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    toast({
      title: "Error",
      description: "Failed to delete job. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

export const getJobById = (id: string): Job | null => {
  try {
    const jobs = getJobs();
    return jobs.find(job => job.id === id) || null;
  } catch (error) {
    console.error('Error getting job by ID:', error);
    return null;
  }
};

export const getActiveJobs = (): Job[] => {
  try {
    const jobs = getJobs();
    return jobs.filter(job => job.status === 'Active');
  } catch (error) {
    console.error('Error getting active jobs:', error);
    return [];
  }
};

export const incrementJobViews = (id: string): void => {
  try {
    const jobs = getJobs();
    const jobIndex = jobs.findIndex(job => job.id === id);
    
    if (jobIndex !== -1) {
      jobs[jobIndex].viewsCount += 1;
      jobs[jobIndex].updatedAt = new Date().toISOString();
      saveJobs(jobs);
    }
  } catch (error) {
    console.error('Error incrementing job views:', error);
  }
};

const generateJobId = (): string => {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const getDefaultJobs = (): Job[] => {
  return [
    {
      id: 'job_default_1',
      title: 'Software Engineer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Join our team as a Software Engineer and work on cutting-edge technologies that connect billions of people worldwide.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of experience in software development',
        'Proficiency in Python, JavaScript, or similar languages',
        'Experience with React, Node.js, or similar frameworks'
      ],
      responsibilities: [
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews and technical discussions'
      ],
      salary: {
        min: 120000,
        max: 180000,
        currency: 'USD'
      },
      benefits: [
        'Health, dental, and vision insurance',
        'Stock options',
        'Flexible working hours',
        'Professional development budget'
      ],
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      postedBy: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@meta.com',
        role: 'Alumni'
      },
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationsCount: 15,
      viewsCount: 127
    },
    {
      id: 'job_default_2',
      title: 'Product Manager Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Internship',
      department: 'Product',
      description: 'Summer internship opportunity for aspiring product managers to work on Google\'s core products.',
      requirements: [
        'Currently pursuing Bachelor\'s or Master\'s degree',
        'Strong analytical and problem-solving skills',
        'Previous internship or project experience preferred',
        'Excellent communication skills'
      ],
      responsibilities: [
        'Assist in product roadmap planning',
        'Conduct user research and analysis',
        'Work with engineering and design teams',
        'Present findings to senior leadership'
      ],
      benefits: [
        'Competitive internship stipend',
        'Housing assistance',
        'Mentorship program',
        'Full-time offer potential'
      ],
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      postedBy: {
        name: 'Admin User',
        email: 'admin@referrify.com',
        role: 'Admin'
      },
      status: 'Active',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicationsCount: 8,
      viewsCount: 89
    }
  ];
};

export const clearJobsData = (): void => {
  try {
    localStorage.removeItem(JOBS_STORAGE_KEY);
    // Clear cookie by setting it to expire
    setCookie(JOBS_STORAGE_KEY, '', -1);
    
    toast({
      title: "Jobs Cleared",
      description: "All job data has been cleared.",
    });
  } catch (error) {
    console.error('Error clearing jobs data:', error);
    toast({
      title: "Error",
      description: "Failed to clear job data.",
      variant: "destructive",
    });
  }
};