import { state as data } from './MockData/runtimeState';
import {
  SublistAccessData,
  SublistFailureData,
  getAllChildrenAccessData,
  sortListItemAccessData,
  getAllChildrenfailureata,
  sortListItemfailureata,
} from './MockData/expectData';
import sublist from '../../utils/SubList';
import getAllChildren from '../../utils/getAllChildren';
import { compCode as willCompCodes, compData as willCompData } from './MockData/willGroupData';
import sortListItem from '../../utils/sortListItem';

test('it has error when convert components mapping to nest group struct', () => {
  expect(sublist(data.compCodes, data.compDatas)).not.toEqual(SublistFailureData);
});

test('Convert components mapping to nest group struct', () => {
  expect(sublist(data.compCodes, data.compDatas)).toEqual(SublistAccessData);
});

test('Get all children of group by pass group code', () => {
  expect(getAllChildren('group_70b806', data.compCodes, data.compDatas)).toEqual(getAllChildrenAccessData);
});

test('Selected Component is grouped in new group', () => {
  expect(sortListItem(willCompCodes, willCompData)).toEqual(sortListItemAccessData);
});

test('it has error when  Get all children of group by pass group code', () => {
  expect(getAllChildren('group_70b806', data.compCodes, data.compDatas)).not.toEqual(getAllChildrenfailureata);
});

test('it has error when  Selected Component is grouped in new group', () => {
  expect(sortListItem(willCompCodes, willCompData)).not.toEqual(sortListItemfailureata);
});
