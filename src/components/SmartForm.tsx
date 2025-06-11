'use client';

import React, { useState } from 'react';
import { User, GraduationCap, Briefcase, Award, Sparkles, Loader, ArrowRight, Trash2, Plus } from 'lucide-react';

interface SmartFormProps {
  onComplete: (data: Record<string, string>) => void;
}

interface EducationEntry {
  year: string;
  school: string;
  department: string;
}

interface ExperienceEntry {
  startYear: string;
  endYear: string;
  company: string;
  position: string;
  description: string;
}

export default function SmartForm({ onComplete }: SmartFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    qualifications: '',
    skills: '',
    summary: ''
  });

  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    { year: '', school: '', department: '' }
  ]);

  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([
    { startYear: '', endYear: '', company: '', position: '', description: '' }
  ]);

  const [aiLoading, setAiLoading] = useState({
    experience: false,
    qualifications: false,
    skills: false,
    summary: false
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    experience: '',
    qualifications: '',
    skills: '',
    summary: ''
  });

  const calculateImportantYears = (age: number) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return {
      highSchool: birthYear + 18,
      university: birthYear + 22,
      workStart: birthYear + 22
    };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgeChange = (age: number) => {
    setFormData(prev => ({ ...prev, age: age.toString() }));
    
    if (age > 0) {
      const years = calculateImportantYears(age);
      setEducationEntries([
        { year: years.highSchool.toString(), school: '', department: '' },
        { year: years.university.toString(), school: '', department: '' }
      ]);
      setExperienceEntries([
        { startYear: years.workStart.toString(), endYear: '', company: '', position: '', description: '' }
      ]);
    }
  };

  const enhanceWithAI = async (type: string, input: string, field: string) => {
    setAiLoading(prev => ({ ...prev, [field]: true }));
    
    try {
      const prompt = getPromptForType(type, input);
      const response = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: formData })
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(prev => ({ ...prev, [field]: data.suggestion }));
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const getPromptForType = (type: string, input: string) => {
    switch (type) {
      case 'enhance_experience':
        return `次の職歴を具体的で魅力的な内容に書き換えてください：「${input}」`;
      case 'improve_qualifications':
        return `この人の資格「${input}」を見て、追加で取得すべき資格を3つ提案してください`;
      case 'suggest_skills':
        return `この経験「${input}」から推測できる技術スキルや能力を具体的に列挙してください`;
      case 'generate_summary':
        return `以下の情報から魅力的な自己PR・職務要約を作成してください：${JSON.stringify(formData)}`;
      default:
        return input;
    }
  };

  const applySuggestion = (field: string, suggestion: string) => {
    setFormData(prev => ({ ...prev, [field]: suggestion }));
    setAiSuggestions(prev => ({ ...prev, [field]: '' }));
  };

  const addEducationEntry = () => {
    setEducationEntries(prev => [...prev, { year: '', school: '', department: '' }]);
  };

  const removeEducationEntry = (index: number) => {
    setEducationEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateEducationEntry = (index: number, field: keyof EducationEntry, value: string) => {
    setEducationEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const addExperienceEntry = () => {
    setExperienceEntries(prev => [...prev, { startYear: '', endYear: '', company: '', position: '', description: '' }]);
  };

  const removeExperienceEntry = (index: number) => {
    setExperienceEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateExperienceEntry = (index: number, field: keyof ExperienceEntry, value: string) => {
    setExperienceEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const educationText = educationEntries
      .filter(entry => entry.school)
      .map(entry => `${entry.year}年 ${entry.school} ${entry.department}`)
      .join('\n');
    
    const experienceText = experienceEntries
      .filter(entry => entry.company)
      .map(entry => `${entry.startYear}年${entry.endYear ? `〜${entry.endYear}年` : '〜現在'} ${entry.company}\n${entry.position}\n${entry.description}`)
      .join('\n\n');

    const completeData = {
      ...formData,
      education: educationText,
      experience: experienceText
    };

    onComplete(completeData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">
          ✨ AI履歴書作成フォーム
        </h2>
        <p className="text-black">
          各項目を入力し、AIボタンで内容を自動改善できます
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            基本情報
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                氏名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="山田太郎"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                年齢
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleAgeChange(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="28"
                  required
                />
                <div className="flex flex-col space-y-1">
                  {[25, 30, 35, 40].map(age => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => handleAgeChange(age)}
                      className="px-2 py-1 bg-blue-100 text-black text-xs rounded hover:bg-blue-200"
                    >
                      {age}歳
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="yamada@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                電話番号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="090-1234-5678"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                住所
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="東京都渋谷区〇〇1-2-3"
                required
              />
            </div>
          </div>
        </div>

        {/* 学歴 */}
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-green-800 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              学歴
            </h3>
            <button
              type="button"
              onClick={addEducationEntry}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              追加
            </button>
          </div>

          <div className="space-y-4">
            {educationEntries.map((entry, index) => (
              <div key={index} className="bg-white p-4 rounded border border-green-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-green-700">学歴 {index + 1}</span>
                  {educationEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducationEntry(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={entry.year}
                      onChange={(e) => updateEducationEntry(index, 'year', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={entry.school}
                      onChange={(e) => updateEducationEntry(index, 'school', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      placeholder="○○大学"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={entry.department}
                      onChange={(e) => updateEducationEntry(index, 'department', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      placeholder="経済学部 卒業"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 職歴 */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-purple-800 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              職歴・職務経験
            </h3>
            <button
              type="button"
              onClick={addExperienceEntry}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              追加
            </button>
          </div>

          <div className="space-y-6">
            {experienceEntries.map((entry, index) => (
              <div key={index} className="bg-white p-4 rounded border border-purple-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-purple-700">職歴 {index + 1}</span>
                  {experienceEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperienceEntry(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      type="text"
                      value={entry.startYear}
                      onChange={(e) => updateExperienceEntry(index, 'startYear', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      placeholder="2020年"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={entry.endYear}
                      onChange={(e) => updateExperienceEntry(index, 'endYear', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      placeholder="2023年（空白で現在）"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      type="text"
                      value={entry.company}
                      onChange={(e) => updateExperienceEntry(index, 'company', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      placeholder="株式会社○○"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={entry.position}
                      onChange={(e) => updateExperienceEntry(index, 'position', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      placeholder="営業部 営業担当"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-black">職務内容</label>
                  <button
                    type="button"
                    onClick={() => enhanceWithAI('enhance_experience', entry.description, 'experience')}
                    disabled={aiLoading.experience}
                    className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-purple-700 disabled:opacity-50"
                  >
                    {aiLoading.experience ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI強化
                  </button>
                </div>

                <textarea
                  value={entry.description}
                  onChange={(e) => updateExperienceEntry(index, 'description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                  placeholder="新規顧客開拓営業を担当。月20件の商談を実施し、売上目標120%を達成。"
                  rows={3}
                />

                {aiSuggestions.experience && (
                  <div className="mt-2 p-3 bg-white border border-purple-300 rounded">
                    <h5 className="font-semibold text-purple-800 text-sm mb-2">🚀 AI強化案</h5>
                    <p className="text-black text-sm mb-2 whitespace-pre-line">{aiSuggestions.experience}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateExperienceEntry(index, 'description', aiSuggestions.experience);
                          setAiSuggestions(prev => ({ ...prev, experience: '' }));
                        }}
                        className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
                      >
                        適用
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiSuggestions(prev => ({ ...prev, experience: '' }))}
                        className="bg-gray-300 text-black px-2 py-1 rounded text-xs hover:bg-gray-400"
                      >
                        却下
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 資格・スキル */}
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-orange-800 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            資格・スキル
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-black">
                  保有資格
                </label>
                <button
                  type="button"
                  onClick={() => enhanceWithAI('improve_qualifications', formData.qualifications, 'qualifications')}
                  disabled={aiLoading.qualifications}
                  className="bg-orange-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-orange-700 disabled:opacity-50"
                >
                  {aiLoading.qualifications ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  提案
                </button>
              </div>
              <textarea
                value={formData.qualifications}
                onChange={(e) => handleInputChange('qualifications', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="普通自動車第一種運転免許&#10;TOEIC 750点&#10;基本情報技術者試験"
                rows={3}
              />
              {aiSuggestions.qualifications && (
                <div className="mt-2 p-3 bg-white border border-orange-300 rounded">
                  <h5 className="font-semibold text-orange-800 text-sm mb-2">🎯 おすすめ資格</h5>
                  <p className="text-black text-sm mb-2 whitespace-pre-line">{aiSuggestions.qualifications}</p>
                  <button
                    type="button"
                    onClick={() => setAiSuggestions(prev => ({ ...prev, qualifications: '' }))}
                    className="bg-gray-300 text-black px-2 py-1 rounded text-xs hover:bg-gray-400"
                  >
                    閉じる
                  </button>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-black">
                  スキル・特技
                </label>
                <button
                  type="button"
                  onClick={() => enhanceWithAI('suggest_skills', formData.experience, 'skills')}
                  disabled={aiLoading.skills}
                  className="bg-orange-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-orange-700 disabled:opacity-50"
                >
                  {aiLoading.skills ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  提案
                </button>
              </div>
              <textarea
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="Microsoft Office&#10;JavaScript, React&#10;コミュニケーション能力"
                rows={3}
              />
              {aiSuggestions.skills && (
                <div className="mt-2 p-3 bg-white border border-orange-300 rounded">
                  <h5 className="font-semibold text-orange-800 text-sm mb-2">💡 スキル提案</h5>
                  <p className="text-black text-sm mb-2 whitespace-pre-line">{aiSuggestions.skills}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applySuggestion('skills', aiSuggestions.skills)}
                      className="bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700"
                    >
                      適用
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSuggestions(prev => ({ ...prev, skills: '' }))}
                      className="bg-gray-300 text-black px-2 py-1 rounded text-xs hover:bg-gray-400"
                    >
                      却下
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 自己PR・職務要約 */}
        <div className="bg-indigo-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-indigo-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              自己PR・職務要約
            </h3>
            <button
              type="button"
              onClick={() => enhanceWithAI('generate_summary', '', 'summary')}
              disabled={aiLoading.summary}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-indigo-700 disabled:opacity-50"
            >
              {aiLoading.summary ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI自動生成
            </button>
          </div>

          {aiSuggestions.summary && (
            <div className="mb-4 p-4 bg-white border border-indigo-300 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI生成：あなたの強みを要約
              </h4>
              <p className="text-black text-sm mb-3 whitespace-pre-line">{aiSuggestions.summary}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => applySuggestion('summary', aiSuggestions.summary)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                >
                  適用
                </button>
                <button
                  type="button"
                  onClick={() => setAiSuggestions(prev => ({ ...prev, summary: '' }))}
                  className="bg-gray-300 text-black px-3 py-1 rounded text-sm hover:bg-gray-400"
                >
                  却下
                </button>
              </div>
            </div>
          )}

          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="AIボタンを押すと、入力された情報から魅力的な自己PR・職務要約を自動生成します"
            rows={4}
          />
        </div>

        {/* 送信ボタン */}
        <div className="text-center pt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            AI履歴書を確認
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-black mt-2 font-medium">
            AIが最適化した内容で履歴書をプレビューします
          </p>
        </div>
      </form>

      {/* AI機能説明 */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <h4 className="font-semibold text-black mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
          🚀 AI機能の特徴
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
              <div>
                <strong className="text-black">職歴AI強化：</strong>
                <span className="text-black">「営業」→「新規顧客開拓営業として月平均20件の商談を実施、売上前年比120%達成」</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
              <div>
                <strong className="text-black">スキル提案：</strong>
                <span className="text-black">職歴から適切なスキルセットを自動提案</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
              <div>
                <strong className="text-black">自己PR生成：</strong>
                <span className="text-black">全情報から魅力的な要約を自動作成</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3"></div>
              <div>
                <strong className="text-black">資格アドバイス：</strong>
                <span className="text-black">キャリアに合った取得すべき資格を提案</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}