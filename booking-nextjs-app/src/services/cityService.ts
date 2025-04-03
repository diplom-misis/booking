import axios from 'axios';

export const fetchCities = async () => {
  try {
    const response = await axios.get('/api/airport?type=city');
    return response.data?.cities ?? [];
  } catch (error) {
    console.error('Ошибка загрузки городов:', error);
    return [];
  }
};