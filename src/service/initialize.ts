import Parse from 'parse';
import { PARSE_ID, PARSE_KEY, PARSE_MASTER_KET, PARSE_SERVER_URL } from './constant';
import { isDemo } from 'demo/isDemo';

const rejectDemo = () => Promise.reject(new Error('Demo mode: Parse is disabled'));

const main = () => {
  if (isDemo) {
    Parse.initialize('demo', 'demo');
    (Parse.CoreManager as unknown as { setRESTController: (controller: unknown) => void }).setRESTController({
      ajax: rejectDemo,
      request: rejectDemo,
      handleError: rejectDemo,
    });
    return;
  }
  Parse.initialize(PARSE_ID, PARSE_KEY, PARSE_MASTER_KET);
  Parse.enableLocalDatastore();
  (Parse as any).serverURL = PARSE_SERVER_URL;
};

export default main;
