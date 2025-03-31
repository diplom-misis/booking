import axios from 'axios';

export const fetchAirportsByCityId = async (cityId: string) => {
  const { data } = await axios.get(`/api/airport?cityId=${cityId}`);
  return data.airports;
};