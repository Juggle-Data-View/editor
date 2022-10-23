import Parse, { initialize } from 'parse';
import { PARSE_ID, PARSE_KEY, PARSE_MASTER_KET, PARSE_SERVER_URL } from './constant';

const main = () => {
  initialize(PARSE_ID, PARSE_KEY, PARSE_MASTER_KET);
  (Parse as any).serverURL = PARSE_SERVER_URL;
  Parse.enableLocalDatastore();
  return Parse;
};

export default main();
