import { writable } from 'svelte/store';
import { CONTROL_PANEL_OPTIONS } from './enums/control-panel.enum';

export const panelView = writable(CONTROL_PANEL_OPTIONS.MAIN);
