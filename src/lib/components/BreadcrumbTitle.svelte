<script lang="ts">
  import type { Crumb } from "$lib/crumb.js";
  import type { ModuleData } from "$lib/types.js";

  export let crumb: Crumb;
  export let routeModules: Record<
    string,
    (() => Promise<ModuleData>) | ModuleData
  >;
  export let pageData: any;

  $: _module = routeModules[crumb.route];

  function logError(e: any) {
    console.error(e);
    return "";
  }

  function renderModuleTitle(module: any) {
    if (module.pageTitle) {
      return module.pageTitle;
    }
    if (module.getPageTitle) {
      return module.getPageTitle(pageData);
    }
    return crumb.title;
  }
</script>

{#if crumb.route}
  {#if _module}
    {#if typeof _module == "function"}
      {#await _module() then result}
        {renderModuleTitle(result)}
      {:catch error}
        {logError(error)}
        {crumb.title}
      {/await}
    {:else}
      {renderModuleTitle(_module)}
    {/if}
  {/if}
{:else}
  {crumb.title}
{/if}
