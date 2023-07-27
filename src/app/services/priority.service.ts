import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  constructor() { }

  private priorityIconMapping: { [iconAddress: string]: { priority: number; name: string } } = {
    '../../assets/lowest.png': { priority: 1, name: 'Easy' },
    '../../assets/low.png': { priority: 2, name: 'Medium' },
    '../../assets/medium.png': { priority: 3, name: 'Hard' },
    '../../assets/high.png': { priority: 4, name: 'Normal' },
    '../../assets/highest.png': { priority: 5, name: 'Difficult' },
  };

  getIconPriority(iconAddress: string): number {
    return this.priorityIconMapping[iconAddress].priority || 0;
  }

  getIconName(iconAddress: string): string {
    return this.priorityIconMapping[iconAddress].name || 'Unknown'; 
  }

  getOptions(){
    let options = ['../../assets/highest.png','../../assets/high.png','../../assets/medium.png','../../assets/low.png','../../assets/lowest.png' ];
    return options;
  }
}