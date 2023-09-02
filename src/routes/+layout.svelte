<script lang="ts">
  import { page } from "$app/stores";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import BreadcrumbTitle from "$lib/components/BreadcrumbTitle.svelte";
</script>

<Breadcrumbs
  url={$page.url}
  routeId={$page.route.id}
  let:crumbs
  let:routeModules
>
  <div>
    <span><a href="/">Home</a></span>
    {#each crumbs as c}
      <span>/</span>
      <span>
        <a href={c.url}>
          <!-- 
          Pass in the glob import of the route svelte modules as well as
          any data the routes can use to try to fill in any info.
          -->
          <BreadcrumbTitle pageData={$page.data} {routeModules} crumb={c} />
        </a>
      </span>
    {/each}
  </div>
</Breadcrumbs>

<slot />
