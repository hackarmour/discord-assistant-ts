export type Command = {
  command: {
    options: [];
    name: string;
    description: string;
    defaultPermission: undefined | boolean;
  };
  run: Function;
};
export type warning = {
  user: string;
  reason: string;
  moderator: string;
  timestamp: number;
};
