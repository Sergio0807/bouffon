export type Category = {
  id: string;
  name: string;
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
  icon: string | null;
  role: 'USER' | 'ADMIN';
  items: Item[];
  groups: Group[];
  createdAt: Date;
};

export type Item = {
  id: string;
  name: string;
  checked: boolean;
  price: number | null;
  categoryId: string;
  groupId: string;
  userId: string;
  category: Category;
  group: Group;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};
