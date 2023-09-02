# Svelte-Breadcrumbs

Svelte-Breadcrumbs will generate breadcrumb data in the following order of priority:

1. Page data `crumbs` property
2. `pageTitle: string` variable or `getPageTitle(data: any) -> string` function exported from the respective svelte page
3. The value in the URL route path
