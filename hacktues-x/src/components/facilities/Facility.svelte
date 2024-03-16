<script lang="ts">
	import { Badge, Button, Card, Checkbox, Dropdown, Input, Label } from 'flowbite-svelte';
	import type { GymDTO } from '../backoffice/panels/dtos/gym.dto';
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	import axiosWithRetry from '../../utility/fetchWIthRetry';
	import { BASEURL } from '$lib/env';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import type { GymInfo } from '../backoffice/panels/dtos/Gym-info.interface';
	let isEdit = false;
	export let tags: string[];
	export let facility: GymDTO;
	console.log(facility);
	const handleDeletion = () => {
		axiosWithRetry.delete(`${BASEURL}/facilities/${facility.id}`);
	};
	let selectedInfo: GymInfo = {
		name: facility.name,
		description: facility.description,
		streetName: facility.streetName,
		tags: facility.tags,
		company: facility.company,
		departments: facility.departments
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

	const ToggleEdit = () => {
		isEdit = !isEdit;
	};

	const SubmitChanges = () => {
		console.log(selectedInfo);
		axiosWithRetry
			.patch(`${BASEURL}/facilities/${facility.id}`, JSON.stringify(selectedInfo), {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((resp) => facility = resp.data)
			.catch((err) => console.log(err));
	};
</script>

<Card class="flex max-h-[30%] max-w-[20%] flex-col items-center">
	<img
		class="max-h-56 max-w-full object-scale-down"
		src={facility.thumbnail.url}
		alt={facility.thumbnail.key}
	/>
	<Label>Name:</Label>
	{#if !isEdit}
		<div>{facility.name}</div>
	{:else}
		<Input bind:value={selectedInfo.name} />
	{/if}
	<Label>Description:</Label>
	{#if !isEdit}
		<div>{facility.description}</div>
	{:else}
		<Input bind:value={selectedInfo.description} />
	{/if}
	<Label>Street Name:</Label>
	{#if !isEdit}
		<div>{facility.streetName}</div>
	{:else}
		<Input bind:value={selectedInfo.streetName} />
	{/if}

	<div>
		{#if !isEdit}
			<Label>Departments:</Label>
			{#each facility.departments as department}
				<Badge class="bg-slate-100">{department}</Badge>
			{/each}
		{/if}
	</div>
	<div>
		{#if !isEdit}
			<Label>Tags:</Label>
			{#each facility.tags as tag}
				<Badge class="bg-slate-100">{tag}</Badge>
			{/each}
		{:else}
			<Button class="self-center text-slate-500">Tags</Button>
			<Dropdown class="z-50 max-h-24 overflow-scroll">
				{#each tags as tag}
					<Checkbox
						checked={selectedInfo.tags.includes(tag)}
						on:click={() => {
							handleSelection({ type: 'tags' }, tag);
						}}>{tag}</Checkbox
					>
				{/each}
			</Dropdown>
		{/if}
		<div>
			<Button on:click={ToggleEdit} class="self-center border text-slate-500"
				>{isEdit ? 'Editing' : 'Edit'}</Button
			>
			{#if isEdit}
				<Button on:click={SubmitChanges} class="self-center border text-slate-500">Submit</Button>
			{/if}
			<button on:click={handleDeletion} class="self-center border text-slate-500">
				<TrashBinOutline />
			</button>
		</div>
	</div></Card
>
