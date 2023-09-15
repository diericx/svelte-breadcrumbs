export type Crumb = {
  title?: string;
  url?: string;
};
export type ModuleData = {
  pageTitle?: string;
  getPageTitle?: (data: any) => string;
};
