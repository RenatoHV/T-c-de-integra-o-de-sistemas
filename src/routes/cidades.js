const express = require('express');
const router = express.Router();
const ibge = require('../services/ibgeService');

router.get('/:sigla_uf', async (req, res) => {
  try {
    const sigla = req.params.sigla_uf;
    if (!sigla || typeof sigla !== 'string' || sigla.length !== 2 || !/^[A-Za-z]{2}$/.test(sigla)) {
      return res.status(400).json({
        erro: true,
        codigo: "SIGLA_UF_INVALIDA",
        mensagem: "A sigla do estado deve conter exatamente 2 letras",
        sigla_uf_informada: sigla
      });
    }

    const limiteQuery = parseInt(req.query.limite || '10', 10);
    const limite = isNaN(limiteQuery) ? 10 : Math.max(1, Math.min(100, limiteQuery));

    const cidades = await ibge.getMunicipiosByUF(sigla.toUpperCase());
    if (!cidades || cidades.length === 0) {
      return res.status(404).json({
        erro: true,
        codigo: "UF_NAO_ENCONTRADA",
        mensagem: "Estado com a sigla informada não foi encontrado",
        sigla_uf_informada: sigla
      });
    }

    const lista = cidades.slice(0, limite).map(c => ({ nome: c.nome }));

    res.json({
      uf: sigla.toUpperCase(),
      quantidade_retornada: lista.length,
      cidades: lista,
      consultado_em: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(503).json({
      erro: true,
      codigo: "SERVICO_EXTERNO_INDISPONIVEL",
      mensagem: "Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes",
      servico: "IBGE"
    });
  }
});

module.exports = router;
