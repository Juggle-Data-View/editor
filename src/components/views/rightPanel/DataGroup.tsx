import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { getJsonMap } from 'utils';
import { selectOriginDatas } from 'store/selectors';

interface DataGroupProps {
  dataSourceId: AutoDV.JsonMap['sourceCode'];
}

type EnmuKeys = (
  data: any,
  rootPath: AutoDV.DataSourceId
) => {
  [path: string]: {
    value: any;
    level: number;
  };
};

/**
 * flatten data struct
 * @param data source data
 * @param path current level sum path
 * @param level nest level
 */
type RecursiveData = (data: any, path: string, level?: number) => any;

const enmuKeys: EnmuKeys = (data, rootPath) => {
  const result: ReturnType<EnmuKeys> = {};
  const recursiveData: RecursiveData = (data, path, level = 0) => {
    if (typeof data === 'object' && !Array.isArray(data)) {
      const keys = Object.keys(data);
      return keys.forEach((key) => {
        // const realPath = path ? `${path}.${key}` : ''; // format path
        result[`${path}.${key}`] = {
          value: data[key],
          level,
        };
        return recursiveData(data[key], `${path}.${key}`, level + 1);
      });
    }
    if (Array.isArray(data)) {
      // const realPath = path ? `${path}.` : ''; // format path
      return data.forEach((item, index) => {
        result[`${path}[${index}]`] = {
          value: item,
          level,
        };
        return recursiveData(item, `${path}[${index}]`, level + 1);
      });
    }

    return (result[path] = { value: data, level });
  };
  recursiveData(data, rootPath as any);
  rootPath && typeof rootPath === 'string' && recursiveData(data, rootPath);
  return result;
};

const DataGroup: React.FC<DataGroupProps> = ({ dataSourceId }) => {
  const originDatas = useSelector(selectOriginDatas);
  const { setFieldValue, values } = useFormikContext<AutoDV.Comp>();
  const dataConfig = values.dataConfig as AutoDV.DataConfig;

  const handleClick = (key: string) => {
    const { auxFieldMap } = getJsonMap(dataConfig);
    //通过过滤辅助结构数组中的key，生成新的辅助结构数组。
    //减少在删除时的遍历次数。
    const newAuxFieldMap = auxFieldMap.filter((item) => item.sourceFieldName !== key);
    const inAuxFieldMap = newAuxFieldMap.length < auxFieldMap.length;
    if (inAuxFieldMap) {
      setFieldValue(`dataConfig.jsonMap.auxFieldMap`, newAuxFieldMap);
    } else {
      const mapCount = Object.keys(auxFieldMap).length;
      const val = `key${mapCount}`;
      // auxFieldMap[key] = val;
      setFieldValue(`dataConfig.jsonMap.auxFieldMap[${mapCount}]`, {
        sourceFieldName: key,
        compFieldName: val,
      });
    }
  };

  const renderSelector = (data: any, id: DataGroupProps['dataSourceId']) => {
    if (!id) {
      return null;
    }
    const originData = data[id];
    const auxiliary = enmuKeys(originData, '');
    const components = [];
    for (const key in auxiliary) {
      const { level } = auxiliary[key];
      const keyArr = key.split('.');
      const optionVal = keyArr[keyArr.length - 1];
      const isSelected = !!getJsonMap(dataConfig).auxFieldMap.find((item) => item.sourceFieldName === key);
      const component = (
        <div key={key} onClick={() => handleClick(key)} style={{ padding: '5px', cursor: 'pointer', width: 'auto' }}>
          {new Array(level).fill(' - ')}
          <span
            style={{
              padding: '3px',
              border: isSelected ? '1px solid #000' : '1px solid #fff',
              borderRadius: '5px',
              backgroundColor: isSelected ? '#fff' : '',
              color: isSelected ? '#000' : '#fff',
            }}
          >
            {optionVal}
          </span>
        </div>
      );
      components.push(component);
    }
    return components;
  };

  return (
    <div
      style={{
        marginLeft: '10px',
        padding: '5px',
        background: '#1e1e1e',
        borderRadius: '2px',
        maxHeight: 300,
        overflow: 'auto',
      }}
    >
      <div style={{ borderLeft: '1px dashed #fff' }}>{renderSelector(originDatas, dataSourceId)}</div>
    </div>
  );
};

export default DataGroup;
