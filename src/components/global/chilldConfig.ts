import { ElInput } from 'element-plus';

// todo
export type TypeChildKey = 'input' | 'select' | 'radio' | 'switch';

export const chilldConfig = {
  input: {
    component: ElInput,
    baseAttrs: {
      clearable: true,
      // ...
    },
  },
};
