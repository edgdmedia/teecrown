export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 1200, suffix: '+', label: 'Travellers served' },
  { value: 40, suffix: '+', label: 'Destinations reached' },
  { value: 48, suffix: 'hr', label: 'Avg. visa turnaround' },
  { value: 98, suffix: '%', label: 'Would book again' },
];
