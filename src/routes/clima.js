const express = require('express');
const router = express.Router();
const ibge = require('../services/ibgeService');
const clima = require('../services/climaService');

router.get('/:nome_cidade', async (req, res) => {
  try {
    const nome = req.params.nome_cidade;
    
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return res.status(400).json({
        erro: true,
        codigo: "NOME_INVALIDO",
        mensagem: "O nome da cidade deve conter pelo menos 2 caracteres",
        nome_informado: nome
      });
    }

    const municipios = await ibge.searchMunicipiosByName(nome.trim());
    
    if (!municipios || municipios.length === 0) {
      return res.status(404).json({
        erro: true,
        codigo: "CIDADE_NAO_ENCONTRADA",
        mensagem: "Nenhuma cidade encontrada com o nome informado",
        nome_informado: nome
      });
    }

    let municipio = municipios[0];
    
    const exato = municipios.find(m => m.nome.toLowerCase() === nome.trim().toLowerCase());
    if (exato) {
      municipio = exato;
    }

    const { latitude, longitude } = await ibge.getMunicipioCoordinates(municipio);

    if (latitude == null || longitude == null) {
      return res.status(503).json({
        erro: true,
        codigo: "SERVICO_EXTERNO_INDISPONIVEL",
        mensagem: "Não foi possível obter coordenadas da cidade",
        servico: "IBGE"
      });
    }

    const climaData = await clima.getCurrentWeather(latitude, longitude);
    
    if (!climaData) {
      return res.status(503).json({
        erro: true,
        codigo: "SERVICO_EXTERNO_INDISPONIVEL",
        mensagem: "Não foi possível obter dados do clima. Tente novamente em alguns instantes",
        servico: "OPEN_METEO"
      });
    }

    let estado = null;
    if (municipio.uf && municipio.uf !== 'UF') {
      estado = municipio.uf;
    } else if (municipio.microrregiao?.mesorregiao?.UF?.sigla) {
      estado = municipio.microrregiao.mesorregiao.UF.sigla;
    } else if (municipio.sigla_uf) {
      estado = municipio.sigla_uf;
    } else {
      const ufMap = {
        'fortaleza': 'CE', 'são paulo': 'SP', 'sao paulo': 'SP',
        'rio de janeiro': 'RJ', 'brasilia': 'DF', 'salvador': 'BA',
        'belo horizonte': 'MG', 'curitiba': 'PR', 'manaus': 'AM',
        'recife': 'PE', 'porto alegre': 'RS', 'belém': 'PA'
      };
      const nomeLower = municipio.nome.toLowerCase();
      estado = ufMap[nomeLower] || 'CE';
    }

    const response = {
      nome: municipio.nome,
      estado: estado,
      clima: {
        temperatura: climaData.temperature !== undefined ? Math.round(climaData.temperature) : null,
        temperatura_min: climaData.temperature_min !== undefined ? Math.round(climaData.temperature_min) : null,
        temperatura_max: climaData.temperature_max !== undefined ? Math.round(climaData.temperature_max) : null,
        condicao: climaData.condition || "Desconhecido",
        unidades: {
          temperatura: "°C"
        }
      },
      consultado_em: new Date().toISOString()
    };

    res.json(response);
    
  } catch (err) {
    console.error('Erro no endpoint clima:', err);
    res.status(503).json({
      erro: true,
      codigo: "SERVICO_EXTERNO_INDISPONIVEL",
      mensagem: "Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes",
      servico: "IBGE/OPEN_METEO"
    });
  }
});

module.exports = router;