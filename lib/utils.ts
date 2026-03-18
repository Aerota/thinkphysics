import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateStudentId(): string {
  return 'STU' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
}

export function generateInvoiceNo(): string {
  return 'INV' + Date.now().toString().slice(-6)
}

export function generateDistributionId(): string {
  return 'D' + Date.now().toString().slice(-6)
}