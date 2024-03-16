import type { Company } from './company.interface';

export interface GymInfo {
	name: string;
	description: string;
	streetName: string;
	tags: string[];
	company: Company;
	departments: string[];
}
