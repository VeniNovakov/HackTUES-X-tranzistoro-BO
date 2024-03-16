<script lang="ts">
	import axios from "axios";
	import Map from "../../../map/Map.svelte";
	import { BASEURL } from "$lib/env";
	import axiosWithRetry from "../../../../utility/fetchWIthRetry";
	import { onMount } from "svelte";
	import type { UserDTO } from "../dtos/User.dto";
	import type { GymDTO } from "../dtos/gym.dto";
  let facilities:GymDTO[];
  onMount(async ()=>{
    let user: UserDTO = (await axiosWithRetry.get(`${BASEURL}/user/me`)).data
    console.log(user)
    const queryParams = {
      companyIds: [user.company?.id],
      userLon:0,
      userLat:0
    };  
    facilities = (await axios.get(`${BASEURL}/facilities/grid`, {params:queryParams})).data;

})

</script>
<div class="h-[90dvh]">
  {#if facilities?.length}
    <Map {facilities}/>
  {/if}
</div>