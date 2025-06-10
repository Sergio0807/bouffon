export type User = {
  id: string;
  name: string;
  icon: string;
  _count?: {
    groups: number;
    items: number;
  };
};
