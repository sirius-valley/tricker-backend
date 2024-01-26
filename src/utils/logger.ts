import { Signale } from 'signale';
import { Constants } from '@utils';

const options = {
  disabled: false,
  interactive: false,
  logLevel: Constants.LOG_LEVEL,
};

export const Logger = new Signale(options);
