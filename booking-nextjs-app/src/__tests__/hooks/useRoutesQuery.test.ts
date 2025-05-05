import { fetchRoutes } from '../../hooks/useRoutesQuery';

describe('fetchRoutes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('builds query params correctly and fetches successfully', async () => {
    const mockResponse = { data: [{ id: 1 }], hasMore: false };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as jest.Mock;

    const params = {
      fromAirport: 'JFK',
      toAirport: 'LAX',
      departureDate: '2025-05-05',
      ticketClass: 'economy',
      passengers: 2,
    };

    const result = await fetchRoutes({ pageParam: 3, ...params });

    // Проверка вызова fetch
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/routes?')
    );

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];

    expect(calledUrl).toContain('fromAirport=JFK');
    expect(calledUrl).toContain('toAirport=LAX');
    expect(calledUrl).toContain('departureDate=2025-05-05');
    expect(calledUrl).toContain('ticketClass=economy');
    expect(calledUrl).toContain('passengers=2');
    expect(calledUrl).toContain('page=3');
    expect(calledUrl).toContain('limit=4');

    expect(result).toEqual(mockResponse);
  });

  it('skips empty/null/undefined values', async () => {
    const mockResponse = { data: [], hasMore: false };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as jest.Mock;

    const params = {
      fromAirport: '',
      toAirport: null,
      departureDate: undefined,
      ticketClass: 'business',
      passengers: 1,
    };

    await fetchRoutes({ pageParam: 1, ...params });

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];

    expect(calledUrl).not.toContain('fromAirport=');
    expect(calledUrl).not.toContain('toAirport=');
    expect(calledUrl).not.toContain('departureDate=');
    expect(calledUrl).toContain('ticketClass=business');
    expect(calledUrl).toContain('passengers=1');
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('limit=4');
  });

  it('throws an error if fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    }) as jest.Mock;

    const params = {
      fromAirport: 'JFK',
      toAirport: 'LAX',
      departureDate: '2025-05-05',
      ticketClass: 'economy',
      passengers: 2,
    };

    await expect(fetchRoutes({ ...params })).rejects.toThrow('Failed to fetch routes');
  });
});
