<script lang="ts">
	import { Card, Button, Label, Input, Toggle, Toast } from 'flowbite-svelte';
	import axios from 'axios'; // Import Axios
	import { BASEURL } from '$lib/env';
	import { CloseOutline, FireOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	export let loginInfo = {
		email: '',
		password: ''
	};

	let showToast = false; // Initialize as false

	const handleChangeCredential = (event) => {
		const { name, value } = event.target;
		loginInfo = { ...loginInfo, [name]: value };
	};

	const handleLogin = async () => {
		try {
			const response = await axios.post(`${BASEURL}/auth/login`, loginInfo); // Send POST request with loginInfo
			console.log(response.data); // Handle response data as needed

			localStorage.setItem('accessToken', response.data.accessToken);
			localStorage.setItem('refreshToken', response.data.refreshToken);

			goto('/backoffice');
		} catch (error) {
			console.error(error); // Handle errors
			showCustomToast();
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault(); // Prevent the default form submission behavior
		await handleLogin(); // Call handleLogin function to send the POST request
	};

	function showCustomToast() {
		showToast = true; // Show the toast
		setTimeout(() => {
			showToast = false; // Hide the toast after a duration (e.g., 3000 ms)
		}, 3000); // Adjust the duration as needed
	}
</script>

<Card class="self-center">
	<form class="flex flex-col space-y-6">
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Welcome to AtlasFlow!</h3>
		<Label class="space-y-2">
			<span>Email</span>
			<Input
				type="text"
				name="email"
				placeholder="name@company.com"
				on:input={handleChangeCredential}
				bind:value={loginInfo.email}
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Password</span>
			<Input
				type="password"
				name="password"
				placeholder="•••••••••••••••"
				on:input={handleChangeCredential}
				required
				bind:value={loginInfo.password}
			/>
		</Label>
		<Button on:click={handleSubmit} color="blue" class="w-full">Login</Button>
	</form>
	{#if showToast}
		<div transition:fade>
			<Toast class="toast absolute top-0" on:close={() => (showToast = false)}>
				<CloseOutline
					slot="icon"
					class=" text-primary-500 bg-primary-100 dark:bg-primary-800 dark:text-primary-200 h-5 w-5"
				/>
				Wrong credentials
			</Toast>
		</div>
	{/if}
</Card>
