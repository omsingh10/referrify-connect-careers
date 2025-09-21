// Enhanced storage utility with cookies and localStorage fallback
import { toast } from "@/components/ui/use-toast";

// Cookie utilities
export const setCookie = (name: string, value: string, days: number = 30): void => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

export const deleteCookie = (name: string): void => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  } catch (error) {
    console.error('Error deleting cookie:', error);
  }
};

// localStorage utilities
export const setLocalStorage = (key: string, value: any): boolean => {
  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
    return true;
  } catch (error) {
    console.error('Error setting localStorage:', error);
    return false;
  }
};

export const getLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    
    // Try to parse as JSON, if it fails return as string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return null;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
};

// Enhanced storage with dual persistence (cookies + localStorage)
export const setUserData = (key: string, value: any, days: number = 30): boolean => {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    // Store in both cookies and localStorage
    setCookie(key, stringValue, days);
    const localStorageSuccess = setLocalStorage(key, value);
    
    return localStorageSuccess;
  } catch (error) {
    console.error('Error setting user data:', error);
    return false;
  }
};

export const getUserData = (key: string): any => {
  try {
    // Try localStorage first (more reliable for large data)
    let data = getLocalStorage(key);
    
    // Fallback to cookies if localStorage fails
    if (data === null) {
      const cookieData = getCookie(key);
      if (cookieData) {
        try {
          data = JSON.parse(cookieData);
          // Sync back to localStorage
          setLocalStorage(key, data);
        } catch {
          data = cookieData;
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUserData = (key: string): void => {
  try {
    deleteCookie(key);
    removeLocalStorage(key);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Session management
export const setUserSession = (userData: {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profilePicture?: string;
}): void => {
  try {
    setUserData('userSession', userData, 7); // 7 days expiry
    setUserData('isLoggedIn', true, 7);
    setUserData('userRole', userData.role, 7);
  } catch (error) {
    console.error('Error setting user session:', error);
  }
};

export const getUserSession = (): any => {
  try {
    return getUserData('userSession');
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

export const clearUserSession = (): void => {
  try {
    // Clear all session-related data
    const keysToRemove = [
      'userSession',
      'isLoggedIn',
      'userRole',
      'profilePicture',
      'studentProfile',
      'alumniProfile',
      'adminProfile'
    ];
    
    keysToRemove.forEach(key => {
      removeUserData(key);
    });
    
    toast({
      title: "Logged out successfully",
      description: "You have been safely logged out of the system.",
    });
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  try {
    const isLoggedIn = getUserData('isLoggedIn');
    const userSession = getUserData('userSession');
    return Boolean(isLoggedIn && userSession);
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Get user role
export const getUserRole = (): 'student' | 'alumni' | 'admin' | null => {
  try {
    return getUserData('userRole');
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};