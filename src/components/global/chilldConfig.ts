import { ElInput } from 'element-plus';

export type TypeChildKey = "input" | "select" | "radio"

export const chilldConfig = {
  input: {
    component: ElInput,
    baseAttrs: {
      clearable: true,
      // ...
    },
  },
};
