<script lang="ts">
	import axios from 'axios';
	import { BASEURL } from '$lib/env';
	import axiosWithRetry from '../../../../utility/fetchWIthRetry';
	import { onMount } from 'svelte';
	import type { GymDTO } from '../dtos/gym.dto';
	import Facility from '../../../facilities/Facility.svelte';

	let tags: string[];
	let departments: string[];
	let facilities: GymDTO[];

	onMount(async () => {
		axios.get(`${BASEURL}/facilities/tags`).then((resp) => (tags = resp.data));
		axios.get(`${BASEURL}/facilities/departments`).then((resp) => (departments = resp.data));

		let user = (await axiosWithRetry.get(`${BASEURL}/user/me`)).data;
		const queryParams = {
			companyIds: [user.company?.id],
			corner1Lat: -180,
			corner2Lat: 180,
			corner1Lon: -180,
			corner2Lon: 180
		};
		facilities = (await axios.get(`${BASEURL}/facilities/map`, { params: queryParams })).data;
		console.log(facilities);
	});
</script>

{#if facilities?.length}
	<div class="flex flex-row flex-wrap">
		{#each facilities as facility}
			<Facility {facility} {tags} />
		{/each}
	</div>
{/if}
