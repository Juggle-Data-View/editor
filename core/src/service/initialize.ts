import Parse from 'parse';
import { PARSE_ID, PARSE_KEY, PARSE_MASTER_KET, PARSE_SERVER_URL } from './constant';

const main = () => {
  if (!(PARSE_ID && PARSE_KEY && PARSE_MASTER_KET && PARSE_SERVER_URL)) {
    throw new Error('system env may empty');
  }

  (Parse as any).serverURL = PARSE_SERVER_URL;
  Parse.initialize(PARSE_ID, PARSE_KEY, PARSE_MASTER_KET);
  Parse.enableLocalDatastore();
};

export default main;
