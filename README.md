# Svelte-Breadcrumbs

Svelte-Breadcrumbs solves the annoying problem of generating meaningful breadcrumbs for routes. When navigating to a route such as this:

Route id: `/todos/[id]/edit`
Route: `/todos/1/edit`

You may want more meaningful data in the breadcrumbs like so:

`Home / Todos / My Todo / Edit`

Svelte-Breadcrumbs will pick up on constant strings or dynamic functions written in your page Svelte files to generate crumbs. The data is collected in the following order of priority:

1. Page data `crumbs` property which overrides the entire `crumbs` array
2. `pageTitle: string` variable or `getPageTitle(data: any) -> string` function exported from the respective svelte page
3. The value in the URL route path

## Usage

### Setting up the Breadcrumb component

In `+layout.svelte`:

1. Import the route modules using a glob import. This is necessary due to the fact that we can't dynamically import files in components.

2. Add the `Breadcrumbs` component and feed in the current page url and the route id while grabbing the crumbs variable.

3. Loop over the generated crumbs array and use the `BreadcrumbTitle` component to generate your breadcrumb titles.

```typescript
<script lang="ts">
  const routeModules = import.meta.glob('../routes/**/*.svelte');
</script>

<Breadcrumbs url={$page.url} routeId={$page.route.id} let:crumbs>
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
```

### Customizing route titles

The `BreadcrumbItems` component will be importing your Svlete components based on the route id and will be looking for the following exported variables in the [Module Context](https://learn.svelte.dev/tutorial/module-exports):

- `pageTitle: string`
- `getPageTitle: (data: any) -> string`

The latter will get the value of `$page.data` passed through (see the `BreadcrumbTitle` usage above).

Here is an example:

```svelte
<script lang="ts">
  export function getPageTitle(data: any) {
    return data.todo.name;
  }
  // or
  export const pageTitle = 'Random Todo';
</script>
```
