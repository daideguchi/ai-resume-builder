'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportOptionsProps {
  data: Record<string, string>;
  onBack: () => void;
  onComplete: () => void;
}

export default function ExportOptions({ data, onBack, onComplete }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFiles, setExportedFiles] = useState<string[]>([]);

  // データから情報を抽出
  const extractInfo = () => {
    const info: Record<string, string | string[]> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      const answer = value as string;
      
      if (answer.includes('名前') || key === '1') {
        info.name = answer.replace(/名前は?/g, '').trim();
      }
      if (answer.includes('年') && answer.includes('月') && answer.includes('日')) {
        info.birthDate = answer;
      }
      if (answer.includes('住所') || answer.includes('県') || answer.includes('市')) {
        info.address = answer.replace(/住所は?/g, '').trim();
      }
      if (answer.match(/\d{2,4}-\d{2,4}-\d{4}/)) {
        info.phone = answer;
      }
      if (answer.includes('@')) {
        info.email = answer;
      }
      if (answer.includes('大学') || answer.includes('学校') || answer.includes('卒業')) {
        if (!info.education) info.education = [];
        if (Array.isArray(info.education)) {
          info.education.push(answer);
        }
      }
      if (answer.includes('会社') || answer.includes('勤務') || answer.includes('職歴')) {
        if (!info.experience) info.experience = [];
        if (Array.isArray(info.experience)) {
          info.experience.push(answer);
        }
      }
      if (answer.includes('資格') || answer.includes('検定') || answer.includes('免許')) {
        if (!info.qualifications) info.qualifications = [];
        if (Array.isArray(info.qualifications)) {
          info.qualifications.push(answer);
        }
      }
      if (answer.includes('スキル') || answer.includes('技術') || answer.includes('得意')) {
        if (!info.skills) info.skills = [];
        if (Array.isArray(info.skills)) {
          info.skills.push(answer);
        }
      }
    });
    
    return info;
  };

  const info = extractInfo();

  const exportToExcel = async () => {
    setIsExporting(true);
    
    try {
      // 履歴書用のワークシート
      const resumeData = [
        ['履歴書'],
        [''],
        ['基本情報'],
        ['氏名', info.name || ''],
        ['生年月日', info.birthDate || ''],
        ['住所', info.address || ''],
        ['電話番号', info.phone || ''],
        ['メールアドレス', info.email || ''],
        [''],
        ['学歴'],
        ...(Array.isArray(info.education) ? info.education : []).map((edu: string, index: number) => [`${index + 1}`, edu]),
        [''],
        ['職歴'],
        ...(Array.isArray(info.experience) ? info.experience : []).map((exp: string, index: number) => [`${index + 1}`, exp]),
        [''],
        ['資格・免許'],
        ...(Array.isArray(info.qualifications) ? info.qualifications : []).map((qual: string, index: number) => [`${index + 1}`, qual]),
        [''],
        ['スキル・特技'],
        ...(Array.isArray(info.skills) ? info.skills : []).map((skill: string, index: number) => [`${index + 1}`, skill]),
      ];

      // 職務経歴書用のワークシート
      const careerData = [
        ['職務経歴書'],
        [''],
        ['基本情報'],
        ['氏名', info.name || ''],
        ['生年月日', info.birthDate || ''],
        ['連絡先', info.phone || ''],
        ['メールアドレス', info.email || ''],
        [''],
        ['職務経歴'],
        ...(Array.isArray(info.experience) ? info.experience : []).map((exp: string, index: number) => [`職歴${index + 1}`, exp]),
        [''],
        ['保有スキル・技術'],
        ...(Array.isArray(info.skills) ? info.skills : []).map((skill: string, index: number) => [`スキル${index + 1}`, skill]),
        [''],
        ['保有資格'],
        ...(Array.isArray(info.qualifications) ? info.qualifications : []).map((qual: string, index: number) => [`資格${index + 1}`, qual]),
      ];

      // ワークブック作成
      const wb = XLSX.utils.book_new();
      
      // 履歴書シート
      const resumeWs = XLSX.utils.aoa_to_sheet(resumeData);
      XLSX.utils.book_append_sheet(wb, resumeWs, '履歴書');
      
      // 職務経歴書シート
      const careerWs = XLSX.utils.aoa_to_sheet(careerData);
      XLSX.utils.book_append_sheet(wb, careerWs, '職務経歴書');

      // ファイル名を生成
      const fileName = `履歴書_${info.name || '未入力'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // ファイルをダウンロード
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      
      setExportedFiles(prev => [...prev, fileName]);
      
    } catch (error) {
      console.error('Excel export error:', error);
      alert('エクスポートに失敗しました。再度お試しください。');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    
    try {
      // 履歴書CSV
      const resumeCSV = [
        ['項目', '内容'],
        ['氏名', info.name || ''],
        ['生年月日', info.birthDate || ''],
        ['住所', info.address || ''],
        ['電話番号', info.phone || ''],
        ['メールアドレス', info.email || ''],
        [''],
        ['学歴', ''],
        ...(Array.isArray(info.education) ? info.education : []).map((edu: string, index: number) => [`学歴${index + 1}`, edu]),
        [''],
        ['職歴', ''],
        ...(Array.isArray(info.experience) ? info.experience : []).map((exp: string, index: number) => [`職歴${index + 1}`, exp]),
        [''],
        ['資格・免許', ''],
        ...(Array.isArray(info.qualifications) ? info.qualifications : []).map((qual: string, index: number) => [`資格${index + 1}`, qual]),
        [''],
        ['スキル・特技', ''],
        ...(Array.isArray(info.skills) ? info.skills : []).map((skill: string, index: number) => [`スキル${index + 1}`, skill]),
      ];

      // CSV文字列に変換
      const csvContent = resumeCSV.map(row => 
        row.map((field: string | string[]) => {
          const fieldStr = Array.isArray(field) ? field.join(', ') : field.toString();
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }).join(',')
      ).join('\n');

      // BOM付きでファイルを作成
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const fileName = `履歴書_${info.name || '未入力'}_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, fileName);
      
      setExportedFiles(prev => [...prev, fileName]);
      
    } catch (error) {
      console.error('CSV export error:', error);
      alert('エクスポートに失敗しました。再度お試しください。');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">エクスポート</h2>
        <p className="text-gray-600">履歴書・職務経歴書をダウンロードしてください。</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Excel エクスポート */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Excel形式</h3>
            <p className="text-gray-600 mb-4">
              履歴書と職務経歴書を別々のシートとして含む<br />
              Excel形式でダウンロード
            </p>
            <button
              onClick={exportToExcel}
              disabled={isExporting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Excel ダウンロード
            </button>
          </div>

          {/* CSV エクスポート */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">CSV形式</h3>
            <p className="text-gray-600 mb-4">
              履歴書情報をCSV形式でダウンロード<br />
              様々なアプリケーションで利用可能
            </p>
            <button
              onClick={exportToCSV}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              CSV ダウンロード
            </button>
          </div>
        </div>

        {/* ダウンロード履歴 */}
        {exportedFiles.length > 0 && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              ダウンロード完了
            </h4>
            <ul className="space-y-1">
              {exportedFiles.map((file, index) => (
                <li key={index} className="text-green-700 text-sm">
                  ✓ {file}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 使用方法 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">使用方法</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Excelファイル：Microsoft Excel、Google Sheets、LibreOfficeなどで開けます</li>
            <li>• CSVファイル：表計算ソフト、データベース、テキストエディタで開けます</li>
            <li>• ダウンロードしたファイルは必要に応じて編集・カスタマイズできます</li>
            <li>• 印刷用にフォーマットを調整することをお勧めします</li>
          </ul>
        </div>
      </div>

      {/* フッター */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            プレビューに戻る
          </button>
          
          <div className="text-sm text-gray-600">
            履歴書作成が完了しました。必要に応じて再度ダウンロードできます。
          </div>
        </div>
      </div>
    </div>
  );
} 