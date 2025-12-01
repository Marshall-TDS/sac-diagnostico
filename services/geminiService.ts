import { GoogleGenAI } from "@google/genai";
import { SACFormData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSACAnalysis = async (data: SACFormData): Promise<string> => {
  const prompt = `
    Atue como um consultor sênior de Processos e Tecnologia. Analise as respostas abaixo de um formulário de diagnóstico de SAC (Serviço de Atendimento ao Consumidor) de uma empresa financeira/educacional.
    
    O objetivo é liberar o tempo do Presidente/Comercial para funções estratégicas.

    DADOS DO DIAGNÓSTICO:
    
    I. Volume e Processos:
    - Canal Principal: ${data.channelPreference}
    - Futuro do Canal: ${data.channelFuture}
    - Divisão (Investidores vs Educacional): ${data.splitInvestorsVsEducation}% Investidores / ${100 - data.splitInvestorsVsEducation}% Educacional
    - Top 5 Problemas: ${data.top5Problems.filter(p => p.trim() !== '').join(', ')}
    - Tempo Demanda Simples: ${data.timeSimple}
    - Tempo Demanda Complexa: ${data.timeComplex}
    - Picos de Volume: ${data.peakPeriods}

    II. Qualidade e Dores:
    - Maior Frustração Cliente: ${data.frustrationPoint}
    - Bloqueadores Estratégicos: ${data.strategicBlockers}
    - Informação Faltante (Histórico): ${data.missingHistory}
    - Frequência de Interrupções Internas: ${data.interruptionFrequency}
    - Porcentagem de Repetição: ${data.repetitionPercentage}%

    III. Tecnologia:
    - Registro Atual: ${data.recordingMethod}
    - Uso de FAQ/Manuais: ${data.documentationUsage}
    - Métrica Desejada: ${data.desiredMetric}

    ---
    
    Gere um relatório conciso e estruturado em Markdown com os seguintes tópicos:

    ## 1. Diagnóstico de Gargalos
    Identifique onde o tempo está sendo desperdiçado e quais processos são frágeis.

    ## 2. Estratégia de Automação (Foco no ${data.channelPreference})
    Sugira como automatizar as perguntas frequentes (Top 5) e reduzir a repetição (${data.repetitionPercentage}%). Seja específico sobre chatbots ou templates.

    ## 3. Plano de Ação Imediato
    3 passos práticos para liberar a agenda estratégica do presidente na próxima semana.

    ## 4. Recomendação de Dados
    Como resolver a falta de histórico (${data.missingHistory}) e começar a medir o (${data.desiredMetric}).

    Mantenha o tom profissional, direto e orientado a solução.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao conectar com Gemini:", error);
    throw error;
  }
};