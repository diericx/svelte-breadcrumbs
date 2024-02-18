import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  if (id == "1") {
    return {
      todo: {
        id: 1,
        name: "My First Todo",
        description: "Here is a description of my first todo",
      },
    };
  }
  return {
    todo: {
      id: 2,
      name: "My Second Todo",
      description: "Here is a description of my second todo",
    },
  };
};
