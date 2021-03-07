import { apiPath } from '../components/apiPath';

test('apiPath test', () => {
    const apiPathDev = apiPath();
    expect(apiPathDev).toBe('http://localhost/lipnonet/rekreace/api/');
})