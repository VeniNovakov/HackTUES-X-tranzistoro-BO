<script>
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';
	import {
		MailBoxSolid,
		LockOpenOutline,
		CirclePlusOutline,
		AddressBookOutline
	} from 'flowbite-svelte-icons';
	$: activeUrl = $page.url.pathname;
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar } from 'flowbite-svelte';
	import { CONTROL_PANEL_OPTIONS } from '../../../stores/enums/control-panel.enum';
	import { panelView } from '../../../stores/control.store';
	import { goto } from '$app/navigation';

	const handleView = (option) => {
		panelView.update(() => {
			return option;
		});
	};

	const handleLogout = () => {
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('accesToken');
		goto('/');
	};
</script>

<div class="m-auto px-8">
	<Navbar class="start-0 top-0 z-20 w-full border-b px-2 py-2.5 sm:px-4">
		<NavBrand href="/">
			<img
				src="/images/flowbite-svelte-icon-logo.svg"
				class="me-3 h-6 sm:h-9"
				alt="Flowbite Logo"
			/>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>AtlasFlow Backoffice</span
			>
		</NavBrand>
		<div class="flex items-center md:order-2">
			<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
		</div>
		<NavUl>
			<Button on:click={() => handleView(CONTROL_PANEL_OPTIONS.PROFILE)}>
				<NavLi active={true}>
					<AddressBookOutline
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					Profile
				</NavLi>
			</Button>
			<Button on:click={() => handleView(CONTROL_PANEL_OPTIONS.NEW_GYM)}>
				<NavLi>
					<CirclePlusOutline
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					Add new gym
				</NavLi>
			</Button>

			<Button on:click={() => handleView(CONTROL_PANEL_OPTIONS.EDIT_GYMS)}>
				<NavLi>
					<CirclePlusOutline
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					Edit gyms
				</NavLi>
			</Button>

			<Button on:click={() => handleView(CONTROL_PANEL_OPTIONS.VIEW_GYMS)}>
				<NavLi>
					<MailBoxSolid
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					View Gyms
				</NavLi>
			</Button>

			<Button on:click={handleLogout}>
				<NavLi>
					<LockOpenOutline
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					Logout
				</NavLi>
			</Button>
		</NavUl>
	</Navbar>
</div>
