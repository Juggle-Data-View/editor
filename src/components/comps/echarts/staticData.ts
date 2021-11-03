const base = [
  {
    date: '周一',
    value: 80,
  },

  {
    date: '周二',
    value: 60,
  },

  {
    date: '周三',
    value: 50,
  },

  {
    date: '周四',
    value: 60,
  },

  {
    date: '周五',
    value: 70,
  },

  {
    date: '周六',
    value: 60,
  },
];

const multi = [
  { name: '周一', svalue1: 80, svalue2: 60, svalue3: 40 },
  { name: '周二', svalue1: 60, svalue2: 30, svalue3: 50 },
  { name: '周三', svalue1: 40, svalue2: 60, svalue3: 30 },
  { name: '周四', svalue1: 70, svalue2: 50, svalue3: 50 },
  { name: '周五', svalue1: 30, svalue2: 60, svalue3: 70 },
  { name: '周六', svalue1: 25, svalue2: 50, svalue3: 60 },
];

const line_bar = [
  {
    brand: '海天',
    order: 40,
    stock: 120,
    procurement: 90,
  },
  {
    brand: '王老吉',
    order: 50,
    stock: 100,
    procurement: 20,
  },
  {
    brand: '恒源祥',
    order: 50,
    stock: 40,
    procurement: 50,
  },
  {
    brand: '光明',
    order: 60,
    stock: 50,
    procurement: 60,
  },
  {
    brand: '蒙牛',
    order: 70,
    stock: 60,
    procurement: 10,
  },
];

const staticData = {
  base_bar: base,
  base_line: base,
  multi_bar: multi,
  multi_line: multi,
  line_bar,
  pie: line_bar,
  double_axis_line_bar: line_bar,
};

export default staticData;
