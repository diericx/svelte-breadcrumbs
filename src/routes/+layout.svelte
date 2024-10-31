<script lang="ts">
  import { page } from "$app/stores";
  import type { Crumb } from "$lib";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import type { MyCrumbMetadata } from "./types";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let pageDataCrumbs = $derived($page.data.crumbs as Crumb<MyCrumbMetadata>[] | undefined);
</script>

<Breadcrumbs
  url={$page.url}
  routeId={$page.route.id}
  pageData={$page.data}
  crumbs={pageDataCrumbs}
  
>
  {#snippet children({ crumbs })}
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
            {c.metadata ? `(${c.metadata.extraValue})` : ""}
          </a>
        </span>
      {/each}
    </div>
  {/snippet}
</Breadcrumbs>

{@render children?.()}
