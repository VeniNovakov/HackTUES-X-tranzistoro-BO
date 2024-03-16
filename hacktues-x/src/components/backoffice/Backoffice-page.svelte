<script>
	import { panelView } from '../../stores/control.store';
	import { CONTROL_PANEL_OPTIONS } from '../../stores/enums/control-panel.enum';
	import NewGym from './panels/actions/New-gym.svelte';
	import Profile from './panels/actions/Profile.svelte';
	import ViewGyms from './panels/actions/View-gyms.svelte';
	import ControlPanel from './panels/control-panel.svelte';
</script>

<ControlPanel />
{#if $panelView === CONTROL_PANEL_OPTIONS.PROFILE}
	<div class="flex flex-row items-center justify-center">
		<Profile />
	</div>
{/if}
{#if $panelView === CONTROL_PANEL_OPTIONS.NEW_GYM}
	<NewGym />
{/if}
{#if $panelView === CONTROL_PANEL_OPTIONS.VIEW_GYMS}
	<ViewGyms />
{/if}
