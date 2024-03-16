<script lang="ts">
	import { BASEURL } from "$lib/env";
	import { Card, Label } from "flowbite-svelte";
	import { onMount } from "svelte";
	import axiosWithRetry from "../../../../utility/fetchWIthRetry";
	import type { UserDTO } from "../dtos/User.dto";
  let user:UserDTO;
  onMount(async () => {
    let resp = await axiosWithRetry.get(`${BASEURL}/user/me`);
    user = resp.data;
  })
</script>
<Card class="self-center">
  <Label color="gray">First name</Label>
  <div class="font-extrabold">{user?.firstName}</div>
  <Label color="gray">Last name</Label>
  <div class="font-extrabold">{user?.lastName}</div>
  <Label color="gray">Company name</Label>
  <div class="font-extrabold">{user?.company.name}</div>
  <Label color="gray">Email</Label>
  <div class="font-extrabold">{user?.email}</div>
</Card>