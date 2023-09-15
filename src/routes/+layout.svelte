<script lang="ts">
  import { page } from "$app/stores";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
</script>

<Breadcrumbs
  url={$page.url}
  routeId={$page.route.id}
  pageData={$page.data}
  let:crumbs
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
          {c.title}
        </a>
      </span>
    {/each}
  </div>
</Breadcrumbs>

<slot />
