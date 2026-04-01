import { Platform } from 'react-native';

export interface MemoryInfo {
  usedMemory: number;
  totalMemory: number;
  freeMemory: number;
  usagePercent: number;
  isLowMemory: boolean;
}

class MemoryService {
  private updateInterval: NodeJS.Timeout | null = null;
  private listeners: ((info: MemoryInfo) => void)[] = [];
  private baseMemory: number = 2048; // 2GB total

  async getMemoryInfo(): Promise<MemoryInfo> {
    try {
      // Simulate memory monitoring
      // In real app, use native modules to get actual memory stats
      const usedMemory = Math.random() * this.baseMemory * 0.75;
      const freeMemory = this.baseMemory - usedMemory;
      const usagePercent = (usedMemory / this.baseMemory) * 100;

      return {
        usedMemory: Math.round(usedMemory),
        totalMemory: this.baseMemory,
        freeMemory: Math.round(freeMemory),
        usagePercent: Math.round(usagePercent),
        isLowMemory: usagePercent > 80,
      };
    } catch (err) {
      console.error('Memory info error:', err);
      return {
        usedMemory: 1024,
        totalMemory: this.baseMemory,
        freeMemory: 1024,
        usagePercent: 50,
        isLowMemory: false,
      };
    }
  }

  startMonitoring(interval: number = 5000): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      const info = await this.getMemoryInfo();
      this.listeners.forEach((listener) => listener(info));
    }, interval);
  }

  stopMonitoring(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  subscribe(listener: (info: MemoryInfo) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async optimizeMemory(): Promise<void> {
    // Trigger garbage collection
    if (global.gc) {
      global.gc();
    }
  }
}

export const memoryService = new MemoryService();
