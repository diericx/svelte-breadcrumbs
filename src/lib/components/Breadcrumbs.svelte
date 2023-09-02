<script lang="ts">
  import type { Crumb } from "$lib/crumb.js";

  // Relative path to the routes folder for the glob import
  export let relPathToRoutes: string = "./";
  // The route from the routers perspective, e.g. $page.route.id
  export let routeId: string | null;
  export let url: URL;
  export let crumbs: Crumb[] | undefined = undefined;

  $: _crumbs = [] as Crumb[];
  $: {
    _crumbs = [] as Crumb[];
    if (crumbs != undefined) {
      _crumbs = [...crumbs];
    } else if (routeId) {
      // The next best case would be to parse the source route and import the
      // page titles from each page.
      let completeUrl = "";
      let completeRoute = "";
      const routes = routeId.split("/").filter((p) => p != "");
      const paths = url.pathname.split("/").filter((p) => p != "");
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let route = routes[i];
        completeUrl += `/${path}`;
        // For some reason the import doesn't like adding the slash here...
        completeRoute += `${route}`;

        // Setup the crumb
        let crumb: Crumb = {
          // Only set url if it is not the last one
          url: i == paths.length - 1 ? undefined : completeUrl,
          route:
            relPathToRoutes +
            (relPathToRoutes.slice(-1) == "/" ? "" : "/") +
            completeRoute +
            "/+page.svelte",
          title: path
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
        };

        completeRoute += "/";
        _crumbs.push(crumb);
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
          title: path,
          url: i == paths.length - 1 ? undefined : completeUrl,
        });
      }

      _crumbs = [..._crumbs];
    }
  }
</script>

<slot crumbs={_crumbs} />
