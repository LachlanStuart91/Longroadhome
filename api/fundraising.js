import { fundraisingResponse } from '../lib/fundraising.js';

export default {
  fetch(request) {
    return fundraisingResponse(request);
  },
};
