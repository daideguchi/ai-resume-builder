'use client';

import { useState } from 'react';
import { User, GraduationCap, Briefcase, Star, ArrowRight, Calculator, Plus, Trash2, Sparkles, Loader } from 'lucide-react';

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
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    education: '',
    experience: '',
    skills: '',
    qualifications: '',
    summary: ''
  });

  const [currentAge, setCurrentAge] = useState<number>(36);
  const [showAgeHelper, setShowAgeHelper] = useState<boolean>(false);
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    { year: '', school: '', department: '' }
  ]);
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([
    { startYear: '', endYear: '', company: '', position: '', description: '' }
  ]);

  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});

  const currentYear = new Date().getFullYear();
  
  // 年齢から重要な年を計算
  const calculateImportantYears = (age: number) => {
    const birthYear = currentYear - age;
    return {
      birthYear,
      highSchoolGrad: birthYear + 18,
      collegeGrad: birthYear + 22,
      workStart: birthYear + 22,
      workStart23: birthYear + 23,
      workStart24: birthYear + 24,
    };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgeChange = (age: number) => {
    setCurrentAge(age);
    const years = calculateImportantYears(age);
    setFormData(prev => ({
      ...prev,
      birthDate: `${years.birthYear}年生まれ（${age}歳）`
    }));
  };

  // AI補完機能
  const enhanceWithAI = async (type: string, input: string, field: string) => {
    if (!input.trim()) return;
    
    setAiLoading(prev => ({ ...prev, [field]: true }));
    
    try {
      const response = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          input,
          userInfo: {
            age: currentAge,
            experience: formData.experience,
            education: formData.education,
            skills: formData.skills
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAiSuggestions(prev => ({ ...prev, [field]: data.enhanced }));
      } else {
        console.error('AI enhancement failed:', data.error);
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const applySuggestion = (field: string, suggestion: string) => {
    handleInputChange(field, suggestion);
    setAiSuggestions(prev => ({ ...prev, [field]: '' }));
  };

  const addEducationEntry = () => {
    setEducationEntries([...educationEntries, { year: '', school: '', department: '' }]);
  };

  const removeEducationEntry = (index: number) => {
    setEducationEntries(educationEntries.filter((_, i) => i !== index));
  };

  const updateEducationEntry = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = educationEntries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    );
    setEducationEntries(updated);
    
    const educationText = updated
      .filter(entry => entry.year && entry.school)
      .map(entry => `${entry.year}年 ${entry.school} ${entry.department}`)
      .join('\n');
    handleInputChange('education', educationText);
  };

  const addExperienceEntry = () => {
    setExperienceEntries([...experienceEntries, { startYear: '', endYear: '', company: '', position: '', description: '' }]);
  };

  const removeExperienceEntry = (index: number) => {
    setExperienceEntries(experienceEntries.filter((_, i) => i !== index));
  };

  const updateExperienceEntry = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updated = experienceEntries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    );
    setExperienceEntries(updated);
    
    const experienceText = updated
      .filter(entry => entry.startYear && entry.company)
      .map(entry => {
        const period = entry.endYear ? `${entry.startYear}年〜${entry.endYear}年` : `${entry.startYear}年〜現在`;
        return `${period} ${entry.company}\n${entry.position}${entry.description ? ': ' + entry.description : ''}`;
      })
      .join('\n\n');
    handleInputChange('experience', experienceText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const years = calculateImportantYears(currentAge);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
            AI履歴書作成ツール
          </h2>
          <p className="text-black text-lg">AIが自動で内容を最適化・補完します！</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 年齢計算ヘルパー */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-yellow-800 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                年齢計算ヘルパー
              </h3>
              <button
                type="button"
                onClick={() => setShowAgeHelper(!showAgeHelper)}
                className="text-yellow-800 hover:text-yellow-900 font-semibold"
              >
                {showAgeHelper ? '閉じる' : '開く'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">現在の年齢</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => handleAgeChange(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 text-black"
                  min="18"
                  max="80"
                />
              </div>
              <div className="bg-yellow-100 p-2 rounded text-center">
                <div className="text-xs text-black font-semibold">高校卒業</div>
                <div className="font-bold text-black text-lg">{years.highSchoolGrad}年</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded text-center">
                <div className="text-xs text-black font-semibold">大学卒業</div>
                <div className="font-bold text-black text-lg">{years.collegeGrad}年</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded text-center">
                <div className="text-xs text-black font-semibold">就職開始</div>
                <div className="font-bold text-black text-lg">{years.workStart}年</div>
              </div>
            </div>
            
            {showAgeHelper && (
              <div className="bg-white p-4 rounded border border-yellow-200">
                <h4 className="font-semibold text-black mb-2">📅 計算結果詳細</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-black"><strong>生まれ年：</strong> {years.birthYear}年</p>
                    <p className="text-black"><strong>高校卒業：</strong> {years.highSchoolGrad}年3月（18歳）</p>
                    <p className="text-black"><strong>大学卒業：</strong> {years.collegeGrad}年3月（22歳）</p>
                  </div>
                  <div>
                    <p className="text-black"><strong>就職開始：</strong> {years.workStart}年4月（新卒）</p>
                    <p className="text-black"><strong>浪人・院進学：</strong> {years.workStart23}年4月（23歳）</p>
                    <p className="text-black"><strong>修士卒業：</strong> {years.workStart24}年4月（24歳）</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 基本情報 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              基本情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  氏名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="山田 太郎"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  生年月日・年齢 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder={`${years.birthYear}年生まれ（${currentAge}歳）`}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  住所 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="東京都新宿区○○1-2-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="03-1234-5678"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  メールアドレス <span className="text-red-500">*</span>
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
            </div>
          </div>

          {/* 学歴（AI補完付き） */}
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                学歴
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => enhanceWithAI('optimize_education', formData.education, 'education')}
                  disabled={aiLoading.education}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700 disabled:opacity-50"
                >
                  {aiLoading.education ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  AI最適化
                </button>
                <button
                  type="button"
                  onClick={addEducationEntry}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  追加
                </button>
              </div>
            </div>

            {aiSuggestions.education && (
              <div className="mb-4 p-4 bg-white border border-green-300 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI提案
                </h4>
                <p className="text-black text-sm mb-3">{aiSuggestions.education}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applySuggestion('education', aiSuggestions.education)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    適用
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiSuggestions(prev => ({ ...prev, education: '' }))}
                    className="bg-gray-300 text-black px-3 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    却下
                  </button>
                </div>
              </div>
            )}
            
            {educationEntries.map((entry, index) => (
              <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-black mb-1">卒業年</label>
                    <select
                      value={entry.year}
                      onChange={(e) => updateEducationEntry(index, 'year', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500 text-black"
                    >
                      <option value="">選択</option>
                      <option value={`${years.highSchoolGrad}`}>{years.highSchoolGrad}年（高校）</option>
                      <option value={`${years.collegeGrad}`}>{years.collegeGrad}年（大学）</option>
                      <option value={`${years.workStart24}`}>{years.workStart24}年（大学院）</option>
                      {Array.from({length: 10}, (_, i) => years.collegeGrad - 5 + i).map(year => (
                        <option key={year} value={year}>{year}年</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-black mb-1">学校名</label>
                    <input
                      type="text"
                      value={entry.school}
                      onChange={(e) => updateEducationEntry(index, 'school', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500 text-black"
                      placeholder="○○大学"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-black mb-1">学部・学科</label>
                      <input
                        type="text"
                        value={entry.department}
                        onChange={(e) => updateEducationEntry(index, 'department', e.target.value)}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500 text-black"
                        placeholder="経済学部"
                      />
                    </div>
                    {educationEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 職歴（AI補完付き） */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-800 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                職歴
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => enhanceWithAI('enhance_experience', formData.experience, 'experience')}
                  disabled={aiLoading.experience}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-purple-700 disabled:opacity-50"
                >
                  {aiLoading.experience ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  AI強化
                </button>
                <button
                  type="button"
                  onClick={addExperienceEntry}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  追加
                </button>
              </div>
            </div>

            {aiSuggestions.experience && (
              <div className="mb-4 p-4 bg-white border border-purple-300 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI提案：より魅力的な職歴表現
                </h4>
                <p className="text-black text-sm mb-3 whitespace-pre-line">{aiSuggestions.experience}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applySuggestion('experience', aiSuggestions.experience)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    適用
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiSuggestions(prev => ({ ...prev, experience: '' }))}
                    className="bg-gray-300 text-black px-3 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    却下
                  </button>
                </div>
              </div>
            )}
            
            {experienceEntries.map((entry, index) => (
              <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-black mb-1">開始年</label>
                    <select
                      value={entry.startYear}
                      onChange={(e) => updateExperienceEntry(index, 'startYear', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 text-black"
                    >
                      <option value="">選択</option>
                      <option value={`${years.workStart}`}>{years.workStart}年（新卒）</option>
                      <option value={`${years.workStart23}`}>{years.workStart23}年</option>
                      {Array.from({length: 15}, (_, i) => years.workStart + i).map(year => (
                        <option key={year} value={year}>{year}年</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black mb-1">終了年</label>
                    <select
                      value={entry.endYear}
                      onChange={(e) => updateExperienceEntry(index, 'endYear', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 text-black"
                    >
                      <option value="">現在</option>
                      {Array.from({length: 15}, (_, i) => years.workStart + i + 1).map(year => (
                        <option key={year} value={year}>{year}年</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-black mb-1">会社名</label>
                    <input
                      type="text"
                      value={entry.company}
                      onChange={(e) => updateExperienceEntry(index, 'company', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 text-black"
                      placeholder="株式会社○○"
                    />
                  </div>
                  <div className="flex items-end">
                    {experienceEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperienceEntry(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-black mb-1">部署・職種</label>
                    <input
                      type="text"
                      value={entry.position}
                      onChange={(e) => updateExperienceEntry(index, 'position', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 text-black"
                      placeholder="営業部"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black mb-1">業務内容</label>
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) => updateExperienceEntry(index, 'description', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 text-black"
                      placeholder="新規営業・企画業務"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* スキル・資格（AI提案付き） */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              スキル・資格
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="普通自動車第一種運転免許
TOEIC 750点
基本情報技術者試験"
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
                  placeholder="Microsoft Office
JavaScript, React
コミュニケーション能力"
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

          {/* 自己PR・職務要約（AI生成） */}
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
      </div>

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