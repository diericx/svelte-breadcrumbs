import type { Crumb } from "$lib";
import type { PageServerLoad } from "./$types";

type MyCrumb = Crumb & {
  metadata: string;
};

export const load: PageServerLoad = async ({ locals, url }) => {
  const crumbs: MyCrumb[] = [
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
