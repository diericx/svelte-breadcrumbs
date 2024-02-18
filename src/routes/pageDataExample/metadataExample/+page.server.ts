import type { Crumb } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const crumbs: Crumb[] = [
    {
      title: "Page 1",
      url: "/",
      metadata: "hello",
    },
    {
      title: "Page 2",
      url: "/",
      metadata: "world",
    },
  ];
  return {
    crumbs,
  };
};
