import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageCacheService {
  save(key: string, value: any): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const jsonData = JSON.stringify(value);
      localStorage.setItem(key, jsonData);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) as T : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }

  remove(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.clear();
  }
}
