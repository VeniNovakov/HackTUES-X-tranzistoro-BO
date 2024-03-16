<script>
  import { page } from '$app/stores';
  import { Button, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { ChartSolid, GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketSolid, LockOpenOutline, CirclePlusOutline, AddressBookOutline} from 'flowbite-svelte-icons';
  $: activeUrl = $page.url.pathname;
	import { BASEURL } from '$lib/env';
	import axiosWithRetry from '../../../utility/fetchWIthRetry';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar } from 'flowbite-svelte';
	import { CONTROL_PANEL_OPTIONS } from '../../../stores/enums/control-panel.enum';
	import { panelView } from '../../../stores/control.store';
	import { goto } from '$app/navigation';

  const handleView = (option) =>{
    panelView.update(() =>{
      return option
    });
  }

  const handleLogout = () =>{
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accesToken");
    goto("/")
  }
</script>



<div class="px-8 m-auto">
  <Navbar class="px-2 sm:px-4 py-2.5 w-full z-20 top-0 start-0 border-b">
  <NavBrand href="/">
    <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">AtlasFlow Backoffice</span>
  </NavBrand>
  <div class="flex items-center md:order-2">
    <NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
  </div>
  <NavUl>
    <Button on:click={() => handleView(CONTROL_PANEL_OPTIONS.PROFILE)}>
      <NavLi  active={true}>
          <AddressBookOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        Profile
      </NavLi>
    </Button>
    <Button on:click={() => handleView(CONTROL_PANEL_OPTIONS.NEW_GYM)}>
      <NavLi >
        <CirclePlusOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        Add new gym
      </NavLi>
    </Button>

    <Button on:click={() => handleView(CONTROL_PANEL_OPTIONS.VIEW_GYMS)}>
      <NavLi>
        <MailBoxSolid  class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        View Gyms
      </NavLi>
    </Button>

    <Button on:click={handleLogout}>
      <NavLi>
        <LockOpenOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        Logout
      </NavLi>
    </Button>
  </NavUl>
</Navbar>
</div>