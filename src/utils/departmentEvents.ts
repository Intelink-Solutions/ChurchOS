// Simple event system for department member count updates
// This allows components to communicate without requiring context providers

type DepartmentUpdateListener = (departmentId: string, change: number) => void;

class DepartmentEventManager {
  private listeners: DepartmentUpdateListener[] = [];

  subscribe(listener: DepartmentUpdateListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(departmentId: string, change: number) {
    console.log(`📊 Department Update Event: ${departmentId} changed by ${change}`);
    this.listeners.forEach(listener => {
      try {
        listener(departmentId, change);
      } catch (error) {
        console.error("Error in department update listener:", error);
      }
    });
  }

  // Singleton instance
  static getInstance() {
    if (!DepartmentEventManager.instance) {
      DepartmentEventManager.instance = new DepartmentEventManager();
    }
    return DepartmentEventManager.instance;
  }

  private static instance: DepartmentEventManager;
}

export const departmentEvents = DepartmentEventManager.getInstance();

// Hook for components to listen to department updates
export function useDepartmentUpdateListener(callback: DepartmentUpdateListener) {
  const subscribe = (callback: DepartmentUpdateListener) => {
    const unsubscribe = departmentEvents.subscribe(callback);
    return unsubscribe;
  };

  // In a real React app, this would use useEffect
  // For simplicity, we're just providing the subscription function
  return { subscribe };
}
