import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulated Make Webhook Integration
export const sendRecordToMake = async (record: any) => {
  console.log("🚀 [WEBHOOK SIMULATION] Sending data to Make...");
  console.log("Payload:", JSON.stringify(record, null, 2));
  
  // In a real app, you would do:
  // await fetch('https://hook.eu1.make.com/your-webhook-url', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(record)
  // });
  
  return new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
};
