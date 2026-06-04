const axios = require('axios');

const BRASIL_API_URL = 'https://brasilapi.com.br/api';
const IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

async function searchMunicipiosByName(nome) {
  try {
    const url = `${BRASIL_API_URL}/ibge/municipios/v1/${encodeURIComponent(nome)}`;
    console.log('Buscando cidade:', url);
    
    const resp = await axios.get(url, { timeout: 8000 });
    
    if (resp.data && resp.data.length > 0) {
      return resp.data.map(cidade => ({
        nome: cidade.nome,
        microrregiao: {
          mesorregiao: {
            UF: {
              sigla: cidade.microrregiao?.mesorregiao?.UF?.sigla || cidade.uf || 'UF'
            }
          }
        },
        codigo: cidade.codigo_ibge,
        latitude: cidade.latitude,
        longitude: cidade.longitude,
        uf: cidade.uf || cidade.microrregiao?.mesorregiao?.UF?.sigla || 'UF'
      }));
    }
    return [];
  } catch (err) {
    console.error('Erro Brasil API:', err.message);
    return getCoordenadasConhecidas(nome);
  }
}

async function getMunicipiosByUF(sigla) {
  try {
    const url = `${IBGE_URL}/estados/${sigla.toUpperCase()}/municipios`;
    console.log('Buscando UF:', url);
    
    const resp = await axios.get(url, { timeout: 8000 });
    
    if (resp.data && resp.data.length > 0) {
      return resp.data.map(cidade => ({
        nome: cidade.nome,
        codigo: cidade.id
      }));
    }
    return [];
  } catch (err) {
    console.error('Erro ao buscar cidades por UF:', err.message);
    return [];
  }
}

async function getMunicipioCoordinates(municipio) {
  if (municipio.latitude && municipio.longitude) {
    return {
      latitude: municipio.latitude,
      longitude: municipio.longitude
    };
  }
  
  return getCoordenadaPorNome(municipio.nome);
}

function getCoordenadaPorNome(nome) {
  const coords = {
    'fortaleza': { latitude: -3.7327, longitude: -38.527 },
    'são paulo': { latitude: -23.5505, longitude: -46.6333 },
    'sao paulo': { latitude: -23.5505, longitude: -46.6333 },
    'rio de janeiro': { latitude: -22.9068, longitude: -43.1729 },
    'brasilia': { latitude: -15.8267, longitude: -47.9218 },
    'salvador': { latitude: -12.9777, longitude: -38.5016 },
    'belo horizonte': { latitude: -19.9167, longitude: -43.9345 },
    'curitiba': { latitude: -25.429, longitude: -49.2671 },
    'manaus': { latitude: -3.119, longitude: -60.0217 },
    'recife': { latitude: -8.0476, longitude: -34.877 },
    'porto alegre': { latitude: -30.0346, longitude: -51.2177 },
    'belém': { latitude: -1.4558, longitude: -48.4902 }
  };
  
  const nomeLower = nome.toLowerCase();
  for (const [cidade, coord] of Object.entries(coords)) {
    if (nomeLower.includes(cidade) || cidade.includes(nomeLower)) {
      console.log('Usando coordenada conhecida para:', nome);
      return coord;
    }
  }
  
  return { latitude: null, longitude: null };
}

function getCoordenadasConhecidas(nome) {
  const coord = getCoordenadaPorNome(nome);
  if (coord.latitude) {
   
    let uf = 'UF';
    const ufMap = {
      'fortaleza': 'CE', 'são paulo': 'SP', 'sao paulo': 'SP',
      'rio de janeiro': 'RJ', 'brasilia': 'DF', 'salvador': 'BA',
      'belo horizonte': 'MG', 'curitiba': 'PR', 'manaus': 'AM',
      'recife': 'PE', 'porto alegre': 'RS', 'belém': 'PA'
    };
    
    const nomeLower = nome.toLowerCase();
    for (const [cidade, sigla] of Object.entries(ufMap)) {
      if (nomeLower.includes(cidade)) {
        uf = sigla;
        break;
      }
    }
    
    return [{
      nome: nome,
      microrregiao: { mesorregiao: { UF: { sigla: uf } } },
      latitude: coord.latitude,
      longitude: coord.longitude,
      uf: uf
    }];
  }
  return [];
}

module.exports = {
  searchMunicipiosByName,
  getMunicipiosByUF,
  getMunicipioCoordinates
};