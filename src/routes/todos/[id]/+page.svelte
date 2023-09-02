<script context="module" lang="ts">
  import type { PageData } from "./$types";

  // You can set the page title with a function that will be given
  // data from the component in the layout
  export function getPageTitle(pageData: PageData) {
    return pageData.todo.name;
  }
</script>

<script lang="ts">
  export let data: PageData;
  const { todo } = data;
</script>

<h1>{todo.name}</h1>
<p><b>id: </b>{todo.id}</p>
<p><b>description: </b>{todo.description}</p>

<a href={`/todos/${todo.id}/tasks`}>Tasks</a>
