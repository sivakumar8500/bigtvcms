import { z } from 'zod';

export function createLocationSchema(activeLanguages: string[] = ['en', 'te', 'hi', 'ml']) {
  const activeSet = new Set(activeLanguages && activeLanguages.length > 0 ? activeLanguages : ['en', 'te', 'hi', 'ml']);

  return z.object({
    stateEn: activeSet.has('en')
      ? z.string().trim().min(1, 'English state name is required')
      : z.string().optional(),
    stateTe: activeSet.has('te')
      ? z.string().trim().min(1, 'Telugu state name is required')
      : z.string().optional(),
    stateHi: z.string().optional(),
    stateMl: activeSet.has('ml')
      ? z.string().trim().min(1, 'Malayalam state name is required')
      : z.string().optional(),
    status: z.boolean().optional().default(true),
  });
}

export const locationSchema = createLocationSchema();

export type LocationFormData = {
  stateEn: string;
  stateTe: string;
  stateHi: string;
  stateMl: string;
  status?: boolean;
};
