<script lang="ts">
  import type { Crumb } from "$lib/crumb.js";

  export let crumb: Crumb;
  export let routeModules: Record<string, () => Promise<unknown>>;
  export let pageData: any;

  function logError(e: any) {
    console.error(e);
    return "";
  }

  function importModule(path: string): any {
    console.log(path);
    return routeModules[path]();
  }
</script>

{#if crumb.route}
  {#await importModule(crumb.route) then result}
    {#if result.pageTitle}
      {result.pageTitle}
    {:else if result.getPageTitle}
      {result.getPageTitle(pageData)}
    {:else}
      {crumb.title}
    {/if}
  {:catch error}
    {logError(error)}
    {crumb.title}
  {/await}
{:else}
  {crumb.title}
{/if}
