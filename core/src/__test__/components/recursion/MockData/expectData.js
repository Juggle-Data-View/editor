export const utilsAccessData = ['a.b.c.d.e', 'a.b.c.d.e', 'a.b.c.d.e', 'd.e', 'a.b.d.e', 'a.d.e', 'a'];

export const utilsFailureData = ['a.b.c.d', 'a.b.c.d', 'a.b.c.d', 'a.b.c.d.e', 'a.b.c.d.e', 'a.b.c.d.e', 'a.b'];

export const configAccessData = [
  {
    type: 'fragment',
    name: '',
    children: [
      {
        type: 'text',
        name: 'firstName',
        required: true,
      },
    ],
  },
  {
    type: 'text',
    name: 'firstName',
    required: true,
  },
];

export const configFailureData = [
  {
    type: 'text',
    name: 'firstName',
    required: true,
  },
  {
    type: 'fragment',
    name: '',
    children: [
      {
        type: 'text',
        name: 'firstName',
        required: true,
      },
    ],
  },
];
