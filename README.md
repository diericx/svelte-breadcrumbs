# Svelte-Breadcrumbs

Svelte-Breadcrumbs makes it easy to generate meaningful breadcrumbs. For example, when navigating to a route such as this:

Route id: `/todos/[id]/edit`

Route: `/todos/1/edit`

You may want more meaningful data in the breadcrumbs, such as converting an ID to a name:

`Home / Todos / My Todo / Edit`

For each value in the route id (e.g. `/todos/[id]/edit`) a breadcrumb item is created. To generate the title of each breadcrum item Svelte-Breadcrumbs will attempt to import the module of the `.svelte` file in the cooresponding directory and access a constant string `pageTitle` or getter function `getPageTitle` that was exported. The getter function is applied to the current page's data.

The title is generated with the following priority, each one acting as a fallback for the former:

1. Page data `crumbs` property which overrides the entire `crumbs` array
2. `pageTitle: string` variable in the svelte page's module context
3. `getPageTitle(data: any) -> string` function in the svelte page's module context
4. The value in the original URL route path

## Usage

### Install

```bash
$ npm i svelte-breadcrumbs
```

### Setting up the Breadcrumb component

In `+layout.svelte`:

```svelte
<script lang="ts">
  // Import the route modules using a glob import. This is necessary because
  // we can't dynamically import files with template strings or non-literals
  const routeModules = import.meta.glob('../routes/**/*.svelte');
</script>

<!--
Add the `Breadcrumbs` component and feed in the current page url and the route id while grabbing the crumbs variable.
-->
<Breadcrumbs url={$page.url} routeId={$page.route.id} let:crumbs>
  <div>
    <span><a href="/">Home</a></span>
    <!--
    Loop over the generated crumbs array and use the `BreadcrumbTitle` component to generate your breadcrumb titles.
    -->
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

The `BreadcrumbTitle` component will be importing your Svlete components based on the route id and will be looking for the following exported variables in the [Module Context](https://learn.svelte.dev/tutorial/module-exports):

- `pageTitle: string`
- `getPageTitle: (data: any) -> string`

`getPageTitle` will receive the value of `$page.data` passed through (see the `BreadcrumbTitle` usage above).

Here is an example:

```svelte
<script lang="ts">
  // Getter function
  export function getPageTitle(data: any) {
    // When this is undefined it will fall back to the value in the route (in this case the todo id for the route /todos/1/edit)
    return data.todo?.name;
  }
  // Or a constant
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

This component will provide an array of `Crumb`s to a single slot. The final `Crumb` will never have a URL as it is the current page.

### Props

`relPathToRoutes: string`

The relative path to the `routes/` folder from the file where `Breadcrumbs` is being rendered. This is used when generating the path for each breadcrumb item and is consumed by the `BreadcrumbTitle` component when it tries to import a Svelte file in the cooresponding location.

`routeId: string`

Route id for the current page. In Sveltekit this is `$page.route.id`.

`url: string`

URL for the current page. Used to generate the url that each breadcrumb should link to when clicked on. In SvelteKit this is `$page.url`.

`crumbs: Crumb[]`

A list of `Crum`s that will override/bypass any breadcrumb generation via routes. In SvelteKit if you pass `$page.data.crumbs` or something similar you will be able to override any bread crumbs via page loads.

`titleSanitizer(title: string) -> string`

Each title of the generated `Crumb` items will pass through this function. By default it will add spaces and capitalize (e.g. `myTodos` -> `My Todos`).

## BreadcrumbTitle

Attempts to generate a breadcrumb title by searching the cooresponding route for data.

### Props

`crumb: Crumb`

The crumby little item to be rendered

`routeModules: Record<string, () => Promise<unknown>>`

The files imported via a glob pattern (`import.meta.glob(path: string)`)

`pageData: any`

Page Data to pass through to the `getPageTitle` function living in a route's `page.svelte` file
