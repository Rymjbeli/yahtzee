import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Saves the data to local storage
   * @param key
   * @param data
   * @param platformId
   */
  saveData(key: string, data: string, platformId: any): void {
    if (isPlatformBrowser(platformId)) {
      localStorage.setItem(key, data);
    }
  }

  /**
   * Retrieves data from local storage
   * @param key
   * @param platformId
   */
  getData(key: string, platformId: any): string {
    return (isPlatformBrowser(platformId) && localStorage.getItem(key)) || '';
  }

  /**
   * Removes data from local storage
   * @param key
   * @param platformId
   */
  removeData(key: string, platformId: any): void {
    if (isPlatformBrowser(platformId)) {
      localStorage.removeItem(key);
    }
  }
}
