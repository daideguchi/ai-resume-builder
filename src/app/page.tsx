'use client';

import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import SmartForm from '@/components/SmartForm';
import DocumentPreview from '@/components/DocumentPreview';
import ExportOptions from '@/components/ExportOptions';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFormComplete = (data: Record<string, string>) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handleBackToForm = () => {
    setCurrentStep(1);
  };

  const handleExportComplete = () => {
    setCurrentStep(1);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4 flex items-center justify-center">
            <FileText className="w-10 h-10 text-blue-600 mr-4" />
            AI履歴書・職務経歴書作成ツール
          </h1>
          <p className="text-black text-lg max-w-2xl mx-auto">
            AIが自動で内容を最適化・補完して、プロフェッショナルな履歴書を作成します
          </p>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">AI入力フォーム</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">プレビュー</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">エクスポート</span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        {currentStep === 1 && (
          <SmartForm onComplete={handleFormComplete} />
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <DocumentPreview data={formData} />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleBackToForm}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                フォームに戻る
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                エクスポート
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <ExportOptions 
            data={formData} 
            onComplete={handleExportComplete}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
}
