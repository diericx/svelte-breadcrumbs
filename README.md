# Svelte-Breadcrumbs

Svelte-Breadcrumbs makes it easy to generate meaningful breadcrumbs by leveraging Svelte's directory structure and [Module Context Exports](https://learn.svelte.dev/tutorial/module-exports).

For example, when navigating to a route such as `/todos/[id]/edit` with the URL Pathname being `/todos/1/edit` you can immediately generate the breadcrumb `todos > 1 > edit`.

What if you wanted the id to be the name of the todo itself? The crux of this issue lies in the fact that we are currently on the `/todos/[i]/edit` page, so any breadcrumb ui elements generated in `/todos/[i]/+page.svelte` or breadcrumb data returned in `/todos/[id]/+page.server.ts` will not be immediately available. Without some sort of data sharing or higher level organization we will need to manually construct the breadcrumb list for each route.

With Svelte-Breadcrumbs, the route id is first split (e.g. `/todos/[id]/edit` -> `['todos', '[id]', 'edit']`) giving us the directory for each route. We then import the `+page.svelte` file from the corresponding directory and access a constant string `pageTitle` or getter function `getPageTitle` that was exported. The getter function is called with the current page's data passed in as a parameter.

The title is then generated with the following priority, each one acting as a fallback for it's greater:

1. Page data `crumbs` property which overrides the entire `crumbs` array
2. `pageTitle: string` variable in the svelte page's module context
3. `getPageTitle(data: any) -> string` function in the svelte page's module context
4. The value in the original URL route path

Breadcrumb title definition can now exist within the view itself!

The biggest drawback of this solution is that getter functions have no way of knowing the data that will be provided to them at compile time which can make development a bit tricky. It can be hard to know if a page has the data the getter will need, but this is why the fallbacks exist.

Another drawback I see is that the glob import in `Breadcrumbs.svelte` may be inefficient, specifically may be storing extra data in memory. This hasn't proven to be an issue for my project, but I'm not completely sure how it would fare in larger projects with more Svelte files...

## Usage

### Install

```bash
$ npm i svelte-breadcrumbs
```

### Setting up the Breadcrumb component

In `+layout.svelte`:

```svelte
<!--
Add the `Breadcrumbs` component and feed in the current page url and the route id while grabbing the crumbs variable.
-->
<Breadcrumbs url={$page.url} routeId={$page.route.id} let:crumbs let:routeModules>
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
          any page data to pass through to the getter functions.
          -->
          <BreadcrumbTitle pageData={$page.data} {routeModules} crumb={c} />
        </a>
      </span>
    {/each}
  </div>
</Breadcrumbs>
```

In the example above, `Breadcrumbs.svelte` will handle grabbing all of the modules itself. You can implement this yourself and can even lazy load if you'd like as the components support both functions and objects for the module values.

```svelte
<script lang="ts">
    // Each route exists in this object as an async function. By providing
    // this object to BreadcrumbTitle it will lazy import the modules.
    // To make it more clear, this is the type returned by glob:
    //
    // Record<string, () => Promise<unknown>>
    //
    // Remember to disable module importing on the Breadcrumbs component though!
    const routeModules = import.meta.glob("/src/routes/**/*.svelte");
</script>

<Breadcrumbs url={$page.url} routeId={$page.route.id} let:crumbs shouldImportRouteModules={false}>
  <!-- ...-->
      <BreadcrumbTitle pageData={$page.data} {routeModules} crumb={c} />
  <!-- ...-->
</Breadcrumbs>
```

### Customizing route titles

The `BreadcrumbTitle` component will have access to your Svlete components based on the route id and will be looking for the following exported variables in the [Module Context](https://learn.svelte.dev/tutorial/module-exports):

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
  title?: string; // The default title being the sanitized page inferred from the URL (e.g. Edit)
  url?: string; // The URL of this page (e.g. /todos/1/edit)
  route?: string; // The route id of this page (e.g. /todos/[id]/edit)
};
```

## Full Component Docs

## Breadcrumbs

This component will provide an array of `Crumb`s to a single slot. The final `Crumb` will never have a URL as it is the current page.

### Props

#### `relPathToRoutes: string`

> Optional

> Default Value: `'/src/routes/'`

The path to the `routes/` folder relative to how it was imported. For example, if we are on a route `/todo/[id]/` and we have imported the svelte files like so:

`import.meta.glob("/src/routes/**/*.svelte")`

it will produce an object with the following:

```js
{
  '/src/routes/todo/[id]/+page.svelte': ...Promise obj...
}
```

Thus in order to match that file we need to specify the prefix `/src/routes/`. Breadcrumbs.svelte will essentially do the following to generate a path to the `+page.svelte` file:

```js
relPathToRoutes + routeId + "/+page.svelte";
```

#### `routeId: string | null`

> Required

Route id for the current page. In Sveltekit this is `$page.route.id`.

#### `url: string`

> Required

URL for the current page. Used to generate the url that each breadcrumb should link to when clicked on. In SvelteKit this is `$page.url`.

#### `crumbs: Crumb[]`

> Optional

A list of `Crum`s that will override/bypass any breadcrumb generation via routes. In SvelteKit if you pass `$page.data.crumbs` or something similar you will be able to override any bread crumbs via page loads.

#### `titleSanitizer(title: string) -> string`

> Optional

> Default Value: `(title) => title.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());`

Each title of the generated `Crumb` items will pass through this function. By default it will add spaces and capitalize (e.g. `myTodos` -> `My Todos`).

#### `shouldImportRouteModules`

> Optional

> Default Value: true

Toggle whether `Breadcrumbs.svelte` should attempt to import the modules itself. By default it will run `import.meta.glob("/src/routes/**/*.svelte")` and will evaluate each promise in the `onMount` function, loading them all up front.

## BreadcrumbTitle

Attempts to generate a breadcrumb title by searching the corresponding route modules for data, or falling back to the data in the route itself.

### Props

`crumb: Crumb`

The crumby little item to be rendered. See the type above.

`routeModules: Record<string, () => Promise<unknown>>`

The files imported via a glob pattern (`import.meta.glob(path: string)`)

`pageData: any`

Page Data to pass through to the `getPageTitle` function living in a route's `page.svelte` file
