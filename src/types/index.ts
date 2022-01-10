export type Command = {
  command: {
    options: [];
    name: string;
    description: string;
    defaultPermission: undefined | boolean;
  };
  run: Function;
};
