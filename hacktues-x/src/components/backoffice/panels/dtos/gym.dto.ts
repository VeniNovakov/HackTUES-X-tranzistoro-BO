import type Thumbnail from 'flowbite-svelte/Thumbnail.svelte';
import type { Company } from './company.interface';

export interface GymDTO {
	id: number;
	description: string;
	name: string;
	lat: number;
	lon: number;
	streetName: string;
	company: Company;
	departments: string[];
	tags: string[];
	thumbnail: Thumbnail;
}
