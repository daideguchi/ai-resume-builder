'use client';

import { useState } from 'react';
import { User, Calendar, MapPin, Phone, Mail, GraduationCap, Briefcase, Award, Star, ArrowRight, Calculator, Plus, Trash2 } from 'lucide-react';

interface SimpleFormProps {
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

export default function SimpleForm({ onComplete }: SimpleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    education: '',
    experience: '',
    skills: '',
    qualifications: ''
  });

  const [currentAge, setCurrentAge] = useState<number>(36);
  const [showAgeHelper, setShowAgeHelper] = useState<boolean>(false);
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    { year: '', school: '', department: '' }
  ]);
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([
    { startYear: '', endYear: '', company: '', position: '', description: '' }
  ]);

  const currentYear = new Date().getFullYear();
  
  // 年齢から重要な年を計算
  const calculateImportantYears = (age: number) => {
    const birthYear = currentYear - age;
    return {
      birthYear,
      highSchoolGrad: birthYear + 18, // 通常18歳で高校卒業
      collegeGrad: birthYear + 22,    // 通常22歳で大学卒業
      workStart: birthYear + 22,      // 通常22歳で就職開始
      workStart23: birthYear + 23,    // 浪人・院進学の場合
      workStart24: birthYear + 24,    // 修士卒業
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
    
    // 学歴データを更新
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
    
    // 職歴データを更新
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
          <h2 className="text-3xl font-bold text-black mb-2">履歴書情報入力</h2>
          <p className="text-black text-lg">年齢を入力すると、卒業年などを自動計算します！</p>
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

          {/* 学歴（構造化入力） */}
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
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

          {/* 職歴（構造化入力） */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-800 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                職歴
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

          {/* スキル・資格 */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              スキル・資格
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  保有資格
                </label>
                <textarea
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  placeholder="普通自動車第一種運転免許
TOEIC 750点
基本情報技術者試験"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  スキル・特技
                </label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  placeholder="Microsoft Office
JavaScript, React
コミュニケーション能力"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-lg"
            >
              プレビューを見る
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-black mt-2 font-medium">
              入力内容はいつでも編集できます
            </p>
          </div>
        </form>
      </div>

      {/* 実用的ヘルプ */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <h4 className="font-semibold text-black mb-4">🎯 年齢別・履歴書作成のコツ</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">📚 学歴のポイント</h5>
            <ul className="space-y-1 text-black">
              <li>• 高校卒業から記載</li>
              <li>• 卒業年月を正確に</li>
              <li>• 学部・学科も詳しく</li>
              <li>• 留年・浪人も考慮</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-800 mb-2">💼 職歴のポイント</h5>
            <ul className="space-y-1 text-black">
              <li>• 在籍期間を明確に</li>
              <li>• 部署・役職も記載</li>
              <li>• 業務内容は具体的に</li>
              <li>• 転職理由は前向きに</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h5 className="font-semibold text-orange-800 mb-2">⭐ 年齢別アドバイス</h5>
            <div className="space-y-2 text-black">
              <div><strong>20代前半:</strong> 学歴・資格重視</div>
              <div><strong>20代後半:</strong> 実務経験アピール</div>
              <div><strong>30代:</strong> 実績・マネジメント</div>
              <div><strong>40代+:</strong> 専門性・指導力</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-black mb-2">💡 計算が合わない場合</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
            <div>
              <p><strong>浪人した場合:</strong> 大学卒業が23歳</p>
              <p><strong>留年した場合:</strong> 卒業年を+1年</p>
              <p><strong>大学院進学:</strong> 修士は24歳、博士は27歳</p>
            </div>
            <div>
              <p><strong>専門学校:</strong> 通常2年制で20歳卒業</p>
              <p><strong>短大:</strong> 2年制で20歳卒業</p>
              <p><strong>高卒就職:</strong> 18歳で就職開始</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 