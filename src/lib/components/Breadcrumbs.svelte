<script lang="ts">
  import type { Crumb } from "$lib/crumb.js";
  import type { ModuleData } from "$lib/types.js";
  import { onMount } from "svelte";

  // Relative path to the routes folder for the glob import
  export let relPathToRoutes: string = "/src/routes/";
  // The route from the routers perspective, e.g. $page.route.id
  export let routeId: string | null;
  export let url: URL;
  export let crumbs: Crumb[] | undefined = undefined;
  export function titleSanitizer(title: string) {
    return title
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
  export let routeModules: Record<
    string,
    (() => Promise<ModuleData>) | ModuleData
  > = {};
  export let shouldImportRouteModules = true;

  onMount(async () => {
    // If enabled, import the modules for all svelte files
    if (shouldImportRouteModules) {
      const _routeModules = import.meta.glob("/src/routes/**/*.svelte");
      for (const [key, value] of Object.entries(_routeModules)) {
        const module = (await value()) as ModuleData;
        // Only store the info we need to cut down on memory usage
        routeModules[key] = {
          pageTitle: module.pageTitle,
          getPageTitle: module.getPageTitle,
        };
      }
    }
  });

  let _crumbs = [] as Crumb[];
  $: {
    _crumbs = [] as Crumb[];
    if (crumbs != undefined) {
      _crumbs = [...crumbs];
    } else if (routeId) {
      // The next best case would be to parse the source route and import the
      // page titles from each page.
      let completeUrl = "";
      let completeRoute =
        relPathToRoutes + (relPathToRoutes.slice(-1) == "/" ? "" : "/");
      const routes = routeId.split("/").filter((p) => p != "");
      const paths = url.pathname.split("/").filter((p) => p != "");

      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let route = routes[i];
        completeUrl += `/${path}`;
        // Note: the slash is trailing here because the prefix always exists as the provided
        // relative path to the routes folder, and we are appending another path to
        // the end later
        completeRoute += `${route}/`;

        _crumbs.push({
          // Last crumb gets no url as it is the current page
          url: i == paths.length - 1 ? undefined : completeUrl,
          route: completeRoute + "+page.svelte",
          title: titleSanitizer(path),
        });
      }
      // Force trigger an update
      _crumbs = [..._crumbs];
    } else {
      let completeUrl = "";
      const paths = url.pathname.split("/").filter((p) => p != "");
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        completeUrl += `/${path}`;
        _crumbs.push({
          title: titleSanitizer(path),
          url: i == paths.length - 1 ? undefined : completeUrl,
        });
      }

      _crumbs = [..._crumbs];
    }
  }
</script>

<slot crumbs={_crumbs} {routeModules} />
