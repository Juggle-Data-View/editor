export const state = {
  name: 'a.b.c',
  path: ['./d/e', '/d/e', 'd/e', '#/d/e', '../d/e', '../../d/e', '../../'],
  config: [
    [
      {
        type: 'text',
        name: 'firstName',
        required: true,
      },
    ],
    {
      type: 'text',
      name: 'firstName',
      required: true,
    },
  ],
};
