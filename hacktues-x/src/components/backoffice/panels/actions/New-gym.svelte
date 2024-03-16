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
	let files = []; // FileList type
	let departments: string[] = [];
	// let classes =["a","w","c","d","b" ]
	let tags: string[] = [];
	onMount(async () => {
		axios.get(`${BASEURL}/facilities/tags`).then((resp) => (tags = resp.data));
		axios.get(`${BASEURL}/facilities/departments`).then((resp) => (departments = resp.data));
	});
	let group = 1;

	interface NewGymInfo {
		name: string;
		description: string;
		streetName: string;
		tags: string[];
		company: string;
		classes: string[];
		departments: string[];
	}

	let selectedInfo: NewGymInfo = {
		name: '',
		description: ' ',
		streetName: ' ',
		tags: [],
		company: '',
		classes: [],
		departments: []
	};

	interface InfoSelection {
		type: 'tags' | 'company' | 'departments' | 'name' | 'description' | 'streetName';
	}

	const handleSelection = (selection: InfoSelection, obj: string) => {
		if (
			selection.type === 'company' ||
			selection.type === 'name' ||
			selection.type === 'description'
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
		axiosWithRetry
			.post(`${BASEURL}/facilities`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((resp) => {
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

			<Button class="text-slate-500">Departments</Button>
			<Dropdown class="z-50 max-h-24 overflow-scroll">
				{#each departments as department}
					<Checkbox
						on:click={() => handleSelection({ type: 'departments' }, department)}
						checked={selectedInfo.departments.includes(department)}>{department}</Checkbox
					>
				{/each}
			</Dropdown>
		</div>
		<Button on:click={() => handleSubmit()} class="w-full bg-slate-700">Submit</Button>
	</form>
</div>
