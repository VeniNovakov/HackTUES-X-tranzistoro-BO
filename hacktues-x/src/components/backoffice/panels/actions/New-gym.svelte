<script lang="ts">
	import {
		Input,
		Fileupload,
		Label,
		Listgroup,
		ListgroupItem,
		Dropdown,
		Checkbox,
		Radio,
		DropdownItem,
		Button
	} from 'flowbite-svelte';
	import Map from '../../../map/Map.svelte';
	import axios from 'axios';
	import { BASEURL } from '$lib/env';
	import { onMount } from 'svelte';
	import { lat, lon } from '../../../../stores/lonlat.store';
	import axiosWithRetry from '../../../../utility/fetchWIthRetry';
	import { goto } from '$app/navigation';
	import { panelView } from '../../../../stores/control.store';
	import { CONTROL_PANEL_OPTIONS } from '../../../../stores/enums/control-panel.enum';
	import type { GymInfo } from '../dtos/Gym-info.interface';
	import type { Company } from '../dtos/company.interface';
	let files = []; // FileList type
	let departments: string[] = [];
	let tags: string[] = [];
	onMount(async () => {
		axios.get(`${BASEURL}/facilities/tags`).then((resp) => (tags = resp.data));
		axios.get(`${BASEURL}/facilities/departments`).then((resp) => (departments = resp.data));
	});
	let group = 1;

	let selectedInfo: GymInfo = {
		name: '',
		description: ' ',
		streetName: ' ',
		tags: [],
		company: {} as Company,
		departments: []
	};

	interface InfoSelection {
		type: 'tags' | 'departments' | 'name' | 'description' | 'streetName';
	}

	const handleSelection = (selection: InfoSelection, obj: string) => {
		if (
			selection.type === 'name' ||
			selection.type === 'description' ||
			selection.type === 'streetName'
		) {
			selectedInfo[selection.type] = obj;
		} else {
			selectedInfo[selection.type].includes(obj)
				? selectedInfo[selection.type].splice(selectedInfo[selection.type].indexOf(obj), 1)
				: selectedInfo[selection.type].push(obj);
		}
	};
	const handleNameDescChange = (event) => {
		const { name, value } = event.target;
		selectedInfo = { ...selectedInfo, [name]: value };
	};

	const handleSubmit = () => {
		const formData = new FormData();
		const latitude: number = $lat;
		const longitude: number = $lon;
		if (!longitude || !latitude) {
			alert('You havent chosen a location');
			return;
		}
		if (files?.length < 3) {
			alert('3 pictures required');
			return;
		}
		formData.append('name', selectedInfo.name);
		formData.append('description', selectedInfo.description);
		formData.append('lat', latitude.toString());
		formData.append('lon', longitude.toString());
		formData.append('streetName', selectedInfo.streetName);
		formData.append('thumbnail', files[0]);
		formData.append('departments', selectedInfo.departments.toString());

		for (let i = 1; i < files.length; i++) {
			formData.append('gallery', files[i]);
		}
		for (let i = 0; i < selectedInfo.tags.length; i++) {
			formData.append('tags', selectedInfo.tags[i]);
		}
		for (let i = 0; i < selectedInfo.departments.length; i++) {
			formData.append('departments', selectedInfo.departments[i]);
		}
		axiosWithRetry
			.post(`${BASEURL}/facilities`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((resp) => {
				console.log(resp);
				if (resp.status === 201) {
					panelView.update(() => {
						return CONTROL_PANEL_OPTIONS.MAIN;
					});
				}
			})
			.catch((error) => console.log(error));
	};
</script>

<div class="m-auto mx-[10%] flex h-[90%] w-[90%] flex-row items-center justify-between">
	<div class="z-10 h-[90dvh] w-full object-scale-down">
		<Map></Map>
	</div>
	<form class="ml-6 w-full">
		<Label>Name</Label>
		<Input on:input={handleNameDescChange} bind:value={selectedInfo.name} />
		<Label>Description</Label>
		<Input on:input={handleNameDescChange} bind:value={selectedInfo.description} />
		<Label>Street name</Label>
		<Input on:input={handleNameDescChange} bind:value={selectedInfo.streetName} />
		<Label class="pb-2" for="multiple_files">Upload multiple files</Label>

		<Fileupload id="multiple_files" multiple bind:files />
		<Listgroup items={files} let:item class="mt-2">
			{#if item}
				{item.name}
			{:else}
				<ListgroupItem>No files</ListgroupItem>
			{/if}
		</Listgroup>
		<div class="flex flex-row items-center">
			<Button class="text-slate-500">Tags</Button>
			<Dropdown class="relative max-h-24 max-w-32 overflow-scroll">
				{#each tags as tag}
					<Checkbox
						on:click={() => handleSelection({ type: 'tags' }, tag)}
						checked={selectedInfo.tags.includes(tag)}
					>
						{tag}
					</Checkbox>
				{/each}
			</Dropdown>
		</div>
		<Button on:click={() => handleSubmit()} class="w-full bg-slate-700">Submit</Button>
	</form>
</div>
