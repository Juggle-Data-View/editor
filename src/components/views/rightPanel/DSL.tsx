import { DSLContainer } from './style';
// import { isArray } from 'lodash';
// import { ITreeNode } from '@blueprintjs/core';

interface DSLProps {
  originData: any;
  code: string;
}

// const getObjectAllModels = (
//   value: any,
//   key: string | number,
//   path: string,
//   level: number,
//   TreeNode: ITreeNode[]
// ): ITreeNode[] => {
//   if (typeof value === 'object') {
//     if (isArray(value)) {
//       // TreeNode.push();
//       return value.map((item, index) => {
//         return {
//           id: level,
//           label: path + (index === 0 ? `[{n}]` : `[{n+${index}}]`),
//           childNodes: getObjectAllModels(
//             item,
//             index,
//             path + (index === 0 ? `[{n}]` : `[{n+${index}}]`),
//             index,
//             TreeNode
//           ),
//         };
//       });
//     } else {
//       return Object.keys(value).map((item, index) => {
//         return {
//           id: index,
//           label: path + '.' + item,
//           childNodes: getObjectAllModels(value[key], item, path + '.' + item, index, TreeNode),
//         };
//       });
//     }
//   } else {
//     return [
//       ...TreeNode,
//       {
//         id: level,
//         label: path + '.' + key,
//       },
//     ];
//   }
// };

const DSL: React.FC<DSLProps> = ({ code, originData }) => {
  // const {code} = props;
  // const originData =

  return <DSLContainer />;
};

export default DSL;
