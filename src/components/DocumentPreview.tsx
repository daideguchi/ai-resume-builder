'use client';

import { User, Calendar, MapPin, Phone, Mail, GraduationCap, Briefcase, Award, Star, Edit, Eye } from 'lucide-react';

interface DocumentPreviewProps {
  data: Record<string, string>;
  onConfirm: () => void;
  onEdit: () => void;
}

export default function DocumentPreview({ data, onConfirm, onEdit }: DocumentPreviewProps) {
  const formatMultilineText = (text: string) => {
    return text.split('\n').filter(line => line.trim()).map((line, index) => (
      <div key={index} className="mb-1">{line}</div>
    ));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">プレビュー確認</h2>
        <p className="text-black text-lg">内容を確認してください。修正がある場合は「編集に戻る」をクリックしてください。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 履歴書プレビュー */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h3 className="text-xl font-bold flex items-center">
              <User className="w-5 h-5 mr-2" />
              履歴書
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* 基本情報 */}
            <div className="border-b pb-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <h2 className="text-2xl font-bold text-black mb-2">{data.name || '氏名未入力'}</h2>
                  <div className="space-y-1 text-sm text-black">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {data.birthDate || '生年月日未入力'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {data.address || '住所未入力'}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {data.phone || '電話番号未入力'}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {data.email || 'メールアドレス未入力'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-24 h-32 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                    <span className="text-black text-xs">写真</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 学歴 */}
            <div>
              <h4 className="font-bold text-green-700 mb-2 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                学歴
              </h4>
              <div className="bg-green-50 p-3 rounded text-sm text-black">
                {data.education ? formatMultilineText(data.education) : '学歴未入力'}
              </div>
            </div>

            {/* 職歴 */}
            <div>
              <h4 className="font-bold text-purple-700 mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                職歴
              </h4>
              <div className="bg-purple-50 p-3 rounded text-sm text-black">
                {data.experience ? formatMultilineText(data.experience) : '職歴未入力'}
              </div>
            </div>

            {/* 資格 */}
            {data.qualifications && (
              <div>
                <h4 className="font-bold text-orange-700 mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  資格・免許
                </h4>
                <div className="bg-orange-50 p-3 rounded text-sm text-black">
                  {formatMultilineText(data.qualifications)}
                </div>
              </div>
            )}

            {/* スキル */}
            {data.skills && (
              <div>
                <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  スキル・特技
                </h4>
                <div className="bg-blue-50 p-3 rounded text-sm text-black">
                  {formatMultilineText(data.skills)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 職務経歴書プレビュー */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-purple-600 text-white p-4">
            <h3 className="text-xl font-bold flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              職務経歴書
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* 基本情報（簡潔版） */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-black mb-2">{data.name || '氏名未入力'}</h2>
              <div className="text-sm text-black">
                {data.email || 'メールアドレス未入力'} | {data.phone || '電話番号未入力'}
              </div>
            </div>

            {/* 職歴詳細 */}
            <div>
              <h4 className="font-bold text-purple-700 mb-3">職歴・経験</h4>
              <div className="bg-purple-50 p-4 rounded">
                <div className="text-sm leading-relaxed text-black">
                  {data.experience ? formatMultilineText(data.experience) : '職歴未入力'}
                </div>
              </div>
            </div>

            {/* スキル詳細 */}
            <div>
              <h4 className="font-bold text-blue-700 mb-3">保有スキル</h4>
              <div className="grid grid-cols-1 gap-4">
                {data.skills && (
                  <div className="bg-blue-50 p-4 rounded">
                    <h5 className="font-semibold text-blue-800 mb-2">技術・スキル</h5>
                    <div className="text-sm text-black">
                      {formatMultilineText(data.skills)}
                    </div>
                  </div>
                )}
                {data.qualifications && (
                  <div className="bg-orange-50 p-4 rounded">
                    <h5 className="font-semibold text-orange-800 mb-2">資格・免許</h5>
                    <div className="text-sm text-black">
                      {formatMultilineText(data.qualifications)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 学歴 */}
            <div>
              <h4 className="font-bold text-green-700 mb-3">学歴</h4>
              <div className="bg-green-50 p-4 rounded text-sm text-black">
                {data.education ? formatMultilineText(data.education) : '学歴未入力'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={onEdit}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors duration-200"
        >
          <Edit className="w-5 h-5" />
          編集に戻る
        </button>
        <button
          onClick={onConfirm}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
        >
          <Eye className="w-5 h-5" />
          この内容で完了
        </button>
      </div>

      {/* 注意事項 */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-black">
          <strong>💡 ポイント：</strong> 
          左が一般的な履歴書形式、右が詳細な職務経歴書形式です。
          企業によってどちらか片方、または両方が必要になります。
        </p>
      </div>
    </div>
  );
} 