import Parse from 'parse';
import { PARSE_ID, PARSE_KEY, PARSE_MASTER_KET, PARSE_SERVER_URL } from './constant';

const main = () => {
  Parse.initialize(PARSE_ID, PARSE_KEY, PARSE_MASTER_KET);
  Parse.enableLocalDatastore();
  (Parse as any).serverURL = PARSE_SERVER_URL;
};

export default main;
