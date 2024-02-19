import type { Crumb } from "$lib";
import type { MyCrumbMetadata } from "../../types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const crumbs: Crumb<MyCrumbMetadata>[] = [
    {
      title: "Page 1",
      url: "/",
      metadata: {
        extraValue: "hello",
      },
    },
    {
      title: "Page 2",
      url: "/",
      metadata: {
        extraValue: "world",
      },
    },
  ];
  return {
    crumbs,
  };
};
