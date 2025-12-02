const { GoogleGenAI } = require("@google/genai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY não definida nas variáveis de ambiente do Netlify.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Configuração de servidor ausente (GEMINI_API_KEY)." }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "JSON inválido no corpo da requisição." }),
    };
  }

  const {
    channelPreference,
    channelFuture,
    splitInvestorsVsEducation,
    top5Problems = [],
    timeSimple,
    timeComplex,
    peakPeriods,
    frustrationPoint,
    strategicBlockers,
    missingHistory,
    interruptionFrequency,
    repetitionPercentage,
    recordingMethod,
    documentationUsage,
    desiredMetric,
  } = data;

  const prompt = `
Atue como um consultor sênior de Processos e Tecnologia. Analise as respostas abaixo de um formulário de diagnóstico de SAC (Serviço de Atendimento ao Consumidor) de uma empresa financeira/educacional.

O objetivo é liberar o tempo do Presidente/Comercial para funções estratégicas.

DADOS DO DIAGNÓSTICO:

I. Volume e Processos:
- Canal Principal: ${channelPreference}
- Futuro do Canal: ${channelFuture}
- Divisão (Investidores vs Educacional): ${splitInvestorsVsEducation}% Investidores / ${100 - (splitInvestorsVsEducation || 0)}% Educacional
- Top 5 Problemas: ${top5Problems.filter((p) => (p || "").trim() !== "").join(", ")}
- Tempo Demanda Simples: ${timeSimple}
- Tempo Demanda Complexa: ${timeComplex}
- Picos de Volume: ${peakPeriods}

II. Qualidade e Dores:
- Maior Frustração Cliente: ${frustrationPoint}
- Bloqueadores Estratégicos: ${strategicBlockers}
- Informação Faltante (Histórico): ${missingHistory}
- Frequência de Interrupções Internas: ${interruptionFrequency}
- Porcentagem de Repetição: ${repetitionPercentage}%

III. Tecnologia:
- Registro Atual: ${recordingMethod}
- Uso de FAQ/Manuais: ${documentationUsage}
- Métrica Desejada: ${desiredMetric}

---

Gere um relatório conciso e estruturado em Markdown com os seguintes tópicos:

## 1. Diagnóstico de Gargalos
Identifique onde o tempo está sendo desperdiçado e quais processos são frágeis.

## 2. Estratégia de Automação (Foco no ${channelPreference})
Sugira como automatizar as perguntas frequentes (Top 5) e reduzir a repetição (${repetitionPercentage}%). Seja específico sobre chatbots ou templates.

## 3. Plano de Ação Imediato
3 passos práticos para liberar a agenda estratégica do presidente na próxima semana.

## 4. Recomendação de Dados
Como resolver a falta de histórico (${missingHistory}) e começar a medir o (${desiredMetric}).

Mantenha o tom profissional, direto e orientado a solução.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: response.text || "Não foi possível gerar a análise no momento." }),
    };
  } catch (error) {
    console.error("Erro ao conectar com Gemini na function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao gerar análise com Gemini." }),
    };
  }
};



