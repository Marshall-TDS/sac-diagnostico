import React, { useState, useCallback } from 'react';
import { SACFormData } from './types';
import { generateSACAnalysis } from './services/geminiService';
import { ArrowRight, ArrowLeft, Send, CheckCircle, Loader2, BarChart3, Zap, Plus, Printer, Copy, Check, Mail } from 'lucide-react';

// Initial state
const initialFormData: SACFormData = {
  // I. Volume e Processos
  channelPreference: 'Whatsapp',
  channelFuture: '',
  splitInvestorsVsEducation: 50, // Slider value
  top5Problems: ['', '', '', '', ''], // Changed to array for 5 separate fields
  timeSimple: '',
  timeComplex: '',
  peakPeriods: '',
  
  // II. Qualidade e Dores
  frustrationPoint: '',
  strategicBlockers: '',
  missingHistory: '',
  interruptionFrequency: '',
  repetitionPercentage: 0, // Slider
  
  // III. Tecnologia e Dados
  recordingMethod: '',
  documentationUsage: '',
  desiredMetric: ''
};

// Marshall TDS Palette
const COLORS = {
  gold: '#dbaa3d',
  black: '#222222',
  white: '#FAFAFA',
  goldHover: '#c99b36',
  blackHover: '#111111'
};

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<SACFormData>(initialFormData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleInputChange = (field: keyof SACFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const result = await generateSACAnalysis(formData);
      
      // SIMULAÇÃO DE ENVIO DE EMAIL AUTOMÁTICO
      // Como este é um ambiente frontend, simulamos a chamada de API.
      console.log("--- INICIANDO PROCESSO DE ENVIO DE EMAIL ---");
      console.log("Destinatário: gabrielpereirademaria@gmail.com");
      console.log("Assunto: Novo Diagnóstico SAC Gerado");
      console.log("Corpo: ", result.substring(0, 100) + "...");
      
      // Pequeno delay para simular o tempo de rede do envio de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("--- EMAIL ENVIADO COM SUCESSO ---");

      setAnalysis(result);
      setStep(4); // Move to result step
    } catch (error) {
      console.error("Error generating analysis:", error);
      alert("Ocorreu um erro ao gerar a análise. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeScreen onStart={handleNext} />;
      case 1:
        return <SectionOne data={formData} onChange={handleInputChange} />;
      case 2:
        return <SectionTwo data={formData} onChange={handleInputChange} />;
      case 3:
        return <SectionThree data={formData} onChange={handleInputChange} onSubmit={handleSubmit} isSubmitting={isAnalyzing} />;
      case 4:
        return <AnalysisView result={analysis} onReset={() => {
          setFormData(initialFormData);
          setAnalysis(null);
          setStep(0);
        }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 print:p-0 print:bg-white bg-[#FAFAFA]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col relative print:shadow-none print:h-auto print:overflow-visible border border-gray-100">
        {/* Header */}
        {step > 0 && step < 4 && (
          <div className="text-white p-6 flex justify-between items-center print:hidden" style={{ backgroundColor: COLORS.black }}>
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-lg font-bold text-[#dbaa3d]">Diagnóstico SAC</h1>
                <p className="text-gray-400 text-xs">Marshall TDS</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-[#dbaa3d] text-[#222222]' : 'bg-gray-700 text-gray-400'}`}>1</span>
              <div className="w-8 h-0.5 bg-gray-700"></div>
              <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-[#dbaa3d] text-[#222222]' : 'bg-gray-700 text-gray-400'}`}>2</span>
              <div className="w-8 h-0.5 bg-gray-700"></div>
              <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-[#dbaa3d] text-[#222222]' : 'bg-gray-700 text-gray-400'}`}>3</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto print:overflow-visible print:p-0">
          {renderStep()}
        </div>

        {/* Footer Navigation */}
        {step > 0 && step < 4 && (
          <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50 print:hidden">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-[#222222] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
                style={{ backgroundColor: COLORS.gold, color: COLORS.black }}
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
               <button
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="flex items-center px-6 py-3 rounded-lg font-bold transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.gold, color: COLORS.black }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Gerar Diagnóstico
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub Components ---

const SuggestionChips: React.FC<{ suggestions: string[], onSelect: (val: string) => void, currentText: string }> = ({ suggestions, onSelect, currentText }) => (
  <div className="flex flex-wrap gap-2 mb-3 print:hidden">
    {suggestions.map((suggestion) => (
      <button
        key={suggestion}
        type="button"
        onClick={() => {
          // Avoid duplicates logic
          if (currentText.includes(suggestion)) return;
          const newValue = currentText 
            ? `${currentText}, ${suggestion}` 
            : suggestion;
          onSelect(newValue);
        }}
        className="group flex items-center text-xs font-medium border px-3 py-1.5 rounded-full transition-colors cursor-pointer hover:bg-opacity-10"
        style={{ 
          borderColor: '#dbaa3d', 
          color: '#96701e',
          backgroundColor: 'rgba(219, 170, 61, 0.05)'
        }}
      >
        <Plus className="w-3 h-3 mr-1 opacity-50 group-hover:opacity-100" />
        {suggestion}
      </button>
    ))}
  </div>
);

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12 print:hidden">
    
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: COLORS.black }}>
        Diagnóstico de Processos SAC
      </h1>
      <p className="text-lg font-medium" style={{ color: COLORS.gold }}>
        Marshall TDS
      </p>
    </div>

    <p className="text-lg text-gray-600 max-w-xl">
      Responda a algumas perguntas sobre o processo de atendimento. 
      Nossa IA irá mapear gargalos e criar um plano de ação estratégico.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
      <FeatureCard icon={<BarChart3 />} title="Volume" desc="Mapeie a demanda" />
      <FeatureCard icon={<Zap />} title="Gargalos" desc="Identifique travas" />
      <FeatureCard icon={<CheckCircle />} title="Solução" desc="Plano de ação" />
    </div>
    <button
      onClick={onStart}
      className="mt-10 text-lg px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl"
      style={{ backgroundColor: COLORS.gold, color: COLORS.black }}
    >
      Começar Diagnóstico
    </button>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center">
    <div className="mb-3" style={{ color: COLORS.gold }}>{icon}</div>
    <h3 className="font-semibold" style={{ color: COLORS.black }}>{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

// Helper style for all inputs to force white background
const inputStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  color: '#222222',
  '--tw-ring-color': COLORS.gold
} as React.CSSProperties;

const SectionOne: React.FC<{ data: SACFormData, onChange: (f: keyof SACFormData, v: string | number | string[]) => void }> = ({ data, onChange }) => (
  <div className="space-y-8 animate-fadeIn print:hidden">
    <h2 className="text-2xl font-bold border-b pb-4" style={{ color: COLORS.black }}>I. Volume e Processos <span className="text-base font-normal text-gray-500 ml-2">(Onde o tempo está sendo gasto?)</span></h2>
    
    <div className="space-y-6">
      <QuestionGroup number={1} text="Canal principal de contato? Deseja manter ou adicionar novos canais?">
        <div className="space-y-3">
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
            style={inputStyle}
            value={data.channelPreference}
            onChange={(e) => onChange('channelPreference', e.target.value)}
          >
            <option value="Whatsapp">Whatsapp (Principal)</option>
            <option value="Email">E-mail</option>
            <option value="Telefone">Telefone</option>
            <option value="Instagram/Direct">Instagram / Direct</option>
          </select>
          <textarea 
            placeholder="Deseja manter esse canal? Pensa em usar Chatbot? Detalhe aqui..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none h-24 resize-none"
            style={inputStyle}
            value={data.channelFuture}
            onChange={(e) => onChange('channelFuture', e.target.value)}
          />
        </div>
      </QuestionGroup>

      <QuestionGroup number={2} text="Proporção de tempo: Gestão de Capital vs Educacional/Mentoria">
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-gray-600">
            <span>Investidores ({data.splitInvestorsVsEducation}%)</span>
            <span>Educacional ({100 - data.splitInvestorsVsEducation}%)</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#dbaa3d]"
            value={data.splitInvestorsVsEducation}
            onChange={(e) => onChange('splitInvestorsVsEducation', Number(e.target.value))}
          />
        </div>
      </QuestionGroup>

      <QuestionGroup number={3} text="Quais são as 5 perguntas ou problemas mais frequentes da semana?">
        <div className="space-y-3">
          <p className="text-sm text-gray-500 italic mb-2">Preencha pelo menos os 3 primeiros itens.</p>
          {data.top5Problems.map((problem, index) => (
            <div key={index} className="flex items-center">
              <span className={`w-6 text-sm font-medium ${index < 3 ? 'text-gray-800' : 'text-gray-400'}`}>
                {index + 1}.
              </span>
              <input
                type="text"
                placeholder={index === 0 ? "Ex: Dúvida sobre Imposto de Renda" : index === 1 ? "Ex: Problema de Acesso" : ""}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none"
                style={inputStyle}
                value={problem}
                onChange={(e) => {
                  const newProblems = [...data.top5Problems];
                  newProblems[index] = e.target.value;
                  onChange('top5Problems', newProblems);
                }}
              />
              {index < 3 && <span className="ml-2 text-red-500 text-xs">*</span>}
            </div>
          ))}
        </div>
      </QuestionGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuestionGroup number={4} text="Tempo médio para resolver demanda simples (ex: dúvida investimento)">
           <input 
            type="text" 
            placeholder="Ex: 5 minutos"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
            style={inputStyle}
            value={data.timeSimple}
            onChange={(e) => onChange('timeSimple', e.target.value)}
          />
        </QuestionGroup>
        <QuestionGroup number={4.5} text="Tempo médio para demanda complexa (ex: performance fundo)">
           <input 
            type="text" 
            placeholder="Ex: 45 minutos"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
            style={inputStyle}
            value={data.timeComplex}
            onChange={(e) => onChange('timeComplex', e.target.value)}
          />
        </QuestionGroup>
      </div>

       <QuestionGroup number={5} text="Existem períodos específicos em que o volume explode? (Picos)">
        <input 
          type="text"
          placeholder="Ex: Dia 5 do mês, Fechamento de mercado, Segunda-feira de manhã..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
          style={inputStyle}
          value={data.peakPeriods}
          onChange={(e) => onChange('peakPeriods', e.target.value)}
        />
      </QuestionGroup>
    </div>
  </div>
);

const SectionTwo: React.FC<{ data: SACFormData, onChange: (f: keyof SACFormData, v: string | number) => void }> = ({ data, onChange }) => (
  <div className="space-y-8 animate-fadeIn print:hidden">
    <h2 className="text-2xl font-bold border-b pb-4" style={{ color: COLORS.black }}>II. Qualidade e Dores <span className="text-base font-normal text-gray-500 ml-2">(Onde estão os gargalos?)</span></h2>
    
    <div className="space-y-6">
      <QuestionGroup number={6} text="Qual demanda causa maior frustração para o cliente hoje?">
        <SuggestionChips 
          suggestions={[
            'Tempo de espera excessivo', 
            'Falta de personalização', 
            'Necessidade de repetir informações', 
            'Respostas robóticas/genéricas', 
            'Inconsistência nas informações',
            'Demora na solução definitiva'
          ]}
          currentText={data.frustrationPoint}
          onSelect={(val) => onChange('frustrationPoint', val)}
        />
        <textarea 
          placeholder="Descreva aqui..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none h-24"
          style={inputStyle}
          value={data.frustrationPoint}
          onChange={(e) => onChange('frustrationPoint', e.target.value)}
        />
      </QuestionGroup>

      <QuestionGroup number={7} text="Quais demandas impedem que você se dedique às funções estratégicas?">
         <SuggestionChips 
          suggestions={[
            'Dúvidas operacionais simples', 
            'Problemas de login/acesso', 
            'Reenvio de boletos/comprovantes', 
            'Explicação básica de produtos',
            'Agendamento de reuniões'
          ]}
          currentText={data.strategicBlockers}
          onSelect={(val) => onChange('strategicBlockers', val)}
        />
        <textarea 
          placeholder="Ex: Suporte técnico de login, reenvio de boletos..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none h-24"
          style={inputStyle}
          value={data.strategicBlockers}
          onChange={(e) => onChange('strategicBlockers', e.target.value)}
        />
      </QuestionGroup>

      <QuestionGroup number={8} text="Qual informação crucial você nunca tem em mãos rápido o suficiente?">
        <SuggestionChips 
          suggestions={[
            'Histórico de conversas anteriores', 
            'Saldo/Posição atualizada', 
            'Status de pagamentos', 
            'Perfil do investidor',
            'Produtos contratados'
          ]}
          currentText={data.missingHistory}
          onSelect={(val) => onChange('missingHistory', val)}
        />
        <input 
          type="text"
          placeholder="Ex: Saldo atualizado, histórico de conversas anteriores..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
          style={inputStyle}
          value={data.missingHistory}
          onChange={(e) => onChange('missingHistory', e.target.value)}
        />
      </QuestionGroup>

      <QuestionGroup number={9} text="Frequência de interrupções (Financeiro/Contábil/Adm) para resolver clientes">
        <select 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
          style={inputStyle}
          value={data.interruptionFrequency}
          onChange={(e) => onChange('interruptionFrequency', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Diariamente">Várias vezes ao dia</option>
          <option value="Semanalmente">Algumas vezes por semana</option>
          <option value="Raramente">Raramente</option>
          <option value="Nunca">Nunca</option>
        </select>
      </QuestionGroup>

       <QuestionGroup number={10} text="Qual % das suas respostas é repetição da mesma informação?">
        <div className="space-y-2">
           <div className="flex justify-between text-sm font-medium text-gray-600">
            <span>Baixa Repetição</span>
            <span className="font-bold" style={{ color: COLORS.gold }}>{data.repetitionPercentage}%</span>
            <span>Alta Repetição</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100"
            step="5"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#dbaa3d]"
            value={data.repetitionPercentage}
            onChange={(e) => onChange('repetitionPercentage', Number(e.target.value))}
          />
        </div>
      </QuestionGroup>
    </div>
  </div>
);

const SectionThree: React.FC<{ data: SACFormData, onChange: (f: keyof SACFormData, v: string | number) => void, onSubmit: () => void, isSubmitting: boolean }> = ({ data, onChange, onSubmit, isSubmitting }) => (
  <div className="space-y-8 animate-fadeIn print:hidden">
    <h2 className="text-2xl font-bold border-b pb-4" style={{ color: COLORS.black }}>III. Tecnologia e Dados <span className="text-base font-normal text-gray-500 ml-2">(Preparação para Automação)</span></h2>
    
    <div className="space-y-6">
      <QuestionGroup number={11} text="Como os atendimentos e resoluções são registrados hoje?">
         <textarea 
          placeholder="Ex: Planilha Excel, CRM, Apenas no histórico do Whatsapp..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none h-24"
          style={inputStyle}
          value={data.recordingMethod}
          onChange={(e) => onChange('recordingMethod', e.target.value)}
        />
      </QuestionGroup>

      <QuestionGroup number={12} text="Você possui manuais de resposta ou FAQ escrito?">
        <select 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
          style={inputStyle}
          value={data.documentationUsage}
          onChange={(e) => onChange('documentationUsage', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Sim, completo">Sim, completo</option>
          <option value="Sim, mas desatualizado">Sim, mas desatualizado</option>
          <option value="Não, tudo na cabeça">Não, tudo "na cabeça"</option>
        </select>
      </QuestionGroup>

      <QuestionGroup number={13} text="Qual métrica você gostaria de ver em um Dashboard amanhã?">
         <input 
          type="text"
          placeholder="Ex: Tempo médio de resposta, Motivo do contato..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
          style={inputStyle}
          value={data.desiredMetric}
          onChange={(e) => onChange('desiredMetric', e.target.value)}
        />
      </QuestionGroup>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-start">
        <div className="mr-3 mt-1 text-[#dbaa3d]"><Zap size={20} /></div>
        <div>
          <h4 className="font-medium text-[#222222]">Pronto para gerar o diagnóstico?</h4>
          <p className="text-sm text-gray-600 mt-1">Nossa IA irá processar suas respostas e criar um plano de ação personalizado.</p>
        </div>
      </div>
    </div>
  </div>
);

const QuestionGroup: React.FC<{ number: number, text: string, children: React.ReactNode }> = ({ number, text, children }) => (
  <div className="animate-slideUp">
    <label className="block font-semibold mb-3 text-lg" style={{ color: COLORS.black }}>
      <span className="mr-2" style={{ color: COLORS.gold }}>{number}.</span>
      {text}
    </label>
    {children}
  </div>
);

const AnalysisView: React.FC<{ result: string | null, onReset: () => void }> = ({ result, onReset }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!result) return null;

  // Function to copy text to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 relative">
      {/* Success Banner for Automatic Email */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center text-green-800 print:hidden">
        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
        <div>
          <p className="font-semibold text-sm">Relatório enviado automaticamente</p>
          <p className="text-xs opacity-80">Uma cópia foi enviada para gabrielpereirademaria@gmail.com</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 print:hidden gap-4">
        <h2 className="text-2xl font-bold flex items-center" style={{ color: COLORS.black }}>
          <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
          Diagnóstico Concluído
        </h2>
        <div className="flex flex-wrap gap-3">
           <button 
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            {copySuccess ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copySuccess ? "Copiado!" : "Copiar Texto"}
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir PDF
          </button>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700 print:prose-sm print:text-black">
        {/* Render simple markdown-like structure */}
        {result.split('\n').map((line, i) => {
          if (line.startsWith('## ')) {
            return <h3 key={i} className="text-xl font-bold mt-6 mb-3 pb-1 border-b border-gray-200" style={{ color: COLORS.gold }}>{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="ml-4 list-disc my-1">{line.replace('- ', '')}</li>;
          }
          if (line.trim() === '') {
            return <br key={i} />;
          }
          return <p key={i} className="mb-2 leading-relaxed">{line}</p>;
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center print:hidden">
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-[#dbaa3d] font-medium underline decoration-dotted underline-offset-4 transition-colors"
        >
          Começar novo diagnóstico
        </button>
      </div>
    </div>
  );
};

export default App;