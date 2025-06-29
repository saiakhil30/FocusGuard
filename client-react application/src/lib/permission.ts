// Permission types that FocusGuard requires
export type PermissionType = 'system' | 'camera' | 'notifications' | 'analytics' | 'location';

// Permission status
export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

interface PermissionRequest {
  type: PermissionType;
  reason: string;
  required: boolean;
}

// System permissions required for complete app blocking
const SYSTEM_PERMISSIONS = [
  'device-admin', // Android device administrator
  'accessibility', // Accessibility service for app monitoring
  'usage-stats', // App usage statistics
  'display-over-apps', // Overlay permission for blocking screens
  'modify-system-settings', // System settings modification
];

// Web API permissions
const WEB_PERMISSIONS = {
  camera: 'camera',
  notifications: 'notifications',
  geolocation: 'geolocation',
} as const;

/**
 * Request system-level permissions for complete app blocking
 */
export async function requestSystemPermissions(): Promise<boolean> {
  try {
    // In a real app, this would request Android device admin permissions
    // For web version, we'll simulate the permission request
    
    if ('DeviceMotionEvent' in window && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      // iOS permission request pattern
      const permission = await (DeviceMotionEvent as any).requestPermission();
      return permission === 'granted';
    }
    
    // For other platforms, assume permission is granted for demo
    // In production, this would integrate with native permission APIs
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate user granting permission
        resolve(true);
      }, 1000);
    });
  } catch (error) {
    console.error('Failed to request system permissions:', error);
    return false;
  }
}

/**
 * Request camera permission for AI learning features
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not supported');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    // Stop the stream immediately as we only needed to check permission
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Notification permission denied:', error);
    return false;
  }
}

/**
 * Request location permission for parental controls
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  } catch (error) {
    console.error('Location permission denied:', error);
    return false;
  }
}

/**
 * Request analytics permission (usage statistics)
 */
export async function requestAnalyticsPermission(): Promise<boolean> {
  try {
    // In a real mobile app, this would request usage stats permission
    // For web, we simulate this permission
    
    // Check if we can access performance APIs
    if ('performance' in window && 'getEntriesByType' in performance) {
      return true;
    }
    
    // Simulate permission request
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  } catch (error) {
    console.error('Analytics permission denied:', error);
    return false;
  }
}

/**
 * Request multiple permissions at once
 */
export async function requestPermissions(permissions: PermissionType[]): Promise<boolean> {
  const results = await Promise.allSettled(
    permissions.map(async (permission) => {
      switch (permission) {
        case 'system':
          return await requestSystemPermissions();
        case 'camera':
          return await requestCameraPermission();
        case 'notifications':
          return await requestNotificationPermission();
        case 'location':
          return await requestLocationPermission();
        case 'analytics':
          return await requestAnalyticsPermission();
        default:
          return false;
      }
    })
  );

  // Return true only if all permissions were granted
  return results.every(result => result.status === 'fulfilled' && result.value === true);
}

/**
 * Check current permission status
 */
export async function checkPermissionStatus(permission: PermissionType): Promise<PermissionStatus> {
  try {
    switch (permission) {
      case 'camera':
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            return 'granted';
          } catch {
            return 'denied';
          }
        }
        return 'unknown';

      case 'notifications':
        if ('Notification' in window) {
          switch (Notification.permission) {
            case 'granted':
              return 'granted';
            case 'denied':
              return 'denied';
            default:
              return 'prompt';
          }
        }
        return 'unknown';

      case 'location':
        if (navigator.geolocation) {
          // We can't directly check geolocation permission status in most browsers
          // without making a request, so we return 'unknown'
          return 'unknown';
        }
        return 'unknown';

      case 'system':
      case 'analytics':
        // These would require native app integration to check properly
        return 'unknown';

      default:
        return 'unknown';
    }
  } catch (error) {
    console.error('Error checking permission status:', error);
    return 'unknown';
  }
}

/**
 * Get user-friendly permission descriptions
 */
export function getPermissionDescription(permission: PermissionType): {
  title: string;
  description: string;
  reason: string;
  risks: string[];
} {
  const descriptions = {
    system: {
      title: 'System Control',
      description: 'Complete device control for app blocking',
      reason: 'Required to enforce focus sessions and block distracting apps at the system level',
      risks: [
        'Can prevent access to all blocked apps',
        'May interfere with other system functions',
        'Requires device administrator privileges',
        'Cannot be easily bypassed or disabled during active sessions'
      ]
    },
    camera: {
      title: 'Camera Access',
      description: 'Camera access for AI learning features',
      reason: 'Needed to scan documents, photos, and handwritten notes for AI explanations',
      risks: [
        'App can take photos and videos',
        'Images may be processed by AI services',
        'Content is analyzed for educational purposes'
      ]
    },
    notifications: {
      title: 'Notifications',
      description: 'Send focus reminders and study alerts',
      reason: 'Used to notify you about study sessions, breaks, and blocked app attempts',
      risks: [
        'May send frequent notifications',
        'Notifications cannot be disabled during focus sessions'
      ]
    },
    location: {
      title: 'Location Access',
      description: 'Location sharing for parental controls',
      reason: 'Allows parents/guardians to monitor location for safety (optional feature)',
      risks: [
        'Continuous location tracking when enabled',
        'Location data shared with designated contacts',
        'May affect battery life'
      ]
    },
    analytics: {
      title: 'Usage Analytics',
      description: 'Monitor app usage and screen time',
      reason: 'Tracks which apps you use and for how long to provide insights and blocking',
      risks: [
        'Monitors all app usage',
        'Collects detailed usage statistics',
        'Data used for productivity analysis'
      ]
    }
  };

  return descriptions[permission];
}

/**
 * Show permission rationale to user
 */
export function showPermissionRationale(permission: PermissionType): Promise<boolean> {
  const description = getPermissionDescription(permission);
  
  return new Promise((resolve) => {
    const shouldRequest = confirm(
      `${description.title} Permission Required\n\n` +
      `${description.reason}\n\n` +
      `This permission will allow the app to:\n` +
      `${description.risks.map(risk => `• ${risk}`).join('\n')}\n\n` +
      `Do you want to grant this permission?`
    );
    
    resolve(shouldRequest);
  });
}

/**
 * Validate that all required permissions are granted
 */
export async function validateRequiredPermissions(userPermissions: Record<string, boolean>): Promise<{
  valid: boolean;
  missing: PermissionType[];
}> {
  const requiredPermissions: PermissionType[] = ['system', 'camera'];
  const missing: PermissionType[] = [];

  for (const permission of requiredPermissions) {
    if (!userPermissions[permission]) {
      missing.push(permission);
    }
  }

  return {
    valid: missing.length === 0,
    missing
  };
}
