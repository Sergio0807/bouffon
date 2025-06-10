export type Category = {
  id: string;
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Item = {
  id: string;
  name: string;
  checked: boolean;
  groupId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExtendedItem = Item & {
  price: number | null;
  checkedById: string | null;
  checkedAt: Date | null;
};

export type Group = {
  id: string;
  name: string;
  inviteCode: string;
  items?: Item[];
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name: string;
  icon: string;
  groups?: Group[];
  createdAt: Date;
  updatedAt: Date;
};
