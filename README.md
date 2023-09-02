# Svelte-Breadcrumbs

Svelte-Breadcrumbs makes it easy to generate meaningful breadcrumbs. When navigating to a route such as this:

Route id: `/todos/[id]/edit`
Route: `/todos/1/edit`

You may want more meaningful data in the breadcrumbs:

`Home / Todos / My Todo / Edit`

For each breadcrumb item Svelte-Breadcrumbs will search for a Svelte file at the cooresponding route and read the value of an exported string or getter function. The data is collected in the following order of priority:

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

## Types

```ts
export type Crumb = {
  title?: string;
  url?: string;
  route?: string;
};
```

## Full Component Docs

## Breadcrumbs

This component will provide an array of `Crum`s to a single slot. The final `Crum` will never have a URL as it is the current page.

### Props

`relPathToRoutes: string`

The relative path to the `routes/` folder from the file where `Breadcrumbs` is being rendered. This is used when generating the path for each breadcrumb item and is consumed byt the `BreadcrumbItem` component when it tries to import a Svelte file in the cooresponding location.

`routeId: string`

Route id for the current page. In Sveltekit this is `$page.route.id`.

`url: string`

URL for the current page. Used to generate the url that each breadcrumb should link to when clicked on. In SvelteKit this is `$page.url`.

`crumbs: Crumb[]`

A list of `Crum`s that will override/bypass any breadcrumb generation via routes. In SvelteKit if you pass `$page.data.crumbs` or something similar you will be able to override any bread crumbs via page loads.

`titleSanitizer(title: string) -> string`

Each title of the generated `Crum` items will pass through this function. By default it will add spaces and capitalize (e.g. `myTodos` -> `My Todos`).

## BreadcrumbTitle

Attempts to generate a breadcrum title by searching the cooresponding route for data.

### Props

`crumb: Crumb`

The crummy little item to be rendered

`routeModules: Record<string, () => Promise<unknown>>`

The files imported via a glob pattern (`import.meta.glob(path: string)`)

`pageData: any`

Page Data to pass through to the `getPageTitle` function living in a route's `page.svelte` file
