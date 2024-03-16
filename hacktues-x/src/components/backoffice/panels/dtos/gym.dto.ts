import type { Company } from './company.interface';
import type { ThumbnailPic } from './thumbnail.interface';

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
	thumbnail: ThumbnailPic;
}
