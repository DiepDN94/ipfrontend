// __mocks__/api.js
import MockAdapter from 'axios-mock-adapter';
import api from '../api';

const mock = new MockAdapter(api);

export default api;
export { mock };
