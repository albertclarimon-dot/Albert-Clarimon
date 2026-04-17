import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Actual Make Webhook Integration
export const sendRecordToMake = async (record: any) => {
  try {
    const response = await fetch('https://hook.eu1.make.com/d26exdymj5wo9qryznfbg2281fkuvtjm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    return response.ok;
  } catch (error) {
    console.error("Error sending to Make:", error);
    return false;
  }
};
