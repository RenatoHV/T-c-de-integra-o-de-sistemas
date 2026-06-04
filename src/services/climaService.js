const axios = require('axios');

async function getCurrentWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Sao_Paulo`;
    
    console.log('Buscando clima para:', lat, lon);
    const resp = await axios.get(url, { timeout: 8000 });
    const data = resp.data;
    
    if (!data || !data.current_weather) return null;
    
    const current = data.current_weather;
    const temperature = current.temperature;
    const condition = mapWeatherCodeToText(current.weathercode);
    
    const temp_min = Math.round(temperature - 5);
    const temp_max = Math.round(temperature + 5);

    return {
      temperature,
      temperature_min: temp_min,
      temperature_max: temp_max,
      condition
    };
  } catch (err) {
    console.error('Erro Open-Meteo:', err.message);
    return null;
  }
}

function mapWeatherCodeToText(code) {
  const map = {
    0: 'Céu Limpo',
    1: 'Parcialmente Nublado',
    2: 'Parcialmente Nublado',
    3: 'Nublado',
    45: 'Neblina',
    61: 'Chuva Leve',
    63: 'Chuva Moderada',
    65: 'Chuva Forte',
    80: 'Aguaceiros'
  };
  return map[code] || 'Desconhecido';
}

module.exports = { getCurrentWeather };