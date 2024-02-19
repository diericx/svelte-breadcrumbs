export type Crumb<M = any> = {
  title?: string;
  url?: string;
  metadata?: M;
};
export type ModuleData = {
  pageTitle?: string;
  getPageTitle?: (data: any) => string;
};
