import { SACFormData } from "../types";

export const generateSACAnalysis = async (data: SACFormData): Promise<string> => {
  try {
    const res = await fetch("/.netlify/functions/generate-scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Erro HTTP ao chamar function Netlify:", res.status, await res.text());
      throw new Error("Erro ao chamar serviço de análise.");
    }

    const json = await res.json();
    return json.result || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao conectar com Gemini (via Netlify Function):", error);
    throw error;
  }
};
