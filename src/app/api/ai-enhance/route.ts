import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { type, input, userInfo } = await request.json();

    let prompt = '';
    const currentYear = new Date().getFullYear();
    const age = userInfo?.age || 30;
    
    switch (type) {
      case 'enhance_experience':
        prompt = `
履歴書の職歴を魅力的で具体的に書き直してください。

基本情報：
- 年齢：${age}歳
- 現在年：${currentYear}年
- 入力された職歴：${input}

要求：
1. 具体的な成果・数字を含める
2. アクションワードを使用（達成、管理、企画、改善など）
3. 転職市場で評価される表現に変換
4. 年齢に応じた責任レベルを反映
5. 業界標準のキーワードを含める

出力形式：
改善された職歴のみを日本語で返してください。説明は不要です。

例：
入力：「営業をやっていました」
出力：「新規顧客開拓営業として月平均20件の商談を実施。提案営業により売上前年比120%を達成。チームリーダーとして新人3名の指導も担当。」
`;
        break;

      case 'suggest_skills':
        prompt = `
${age}歳・職歴「${input}」の人に適したスキル・強みを提案してください。

要求：
1. 職歴から推測される実務スキル
2. 年齢に応じたマネジメント・リーダーシップスキル  
3. 現在のビジネストレンドに合ったスキル
4. 転職市場で需要の高いスキル
5. 具体的で説得力のある表現

出力形式：
スキル一覧のみを改行区切りで返してください。説明は不要です。

例：
・顧客折衝・営業スキル
・プロジェクトマネジメント
・チームリーダーシップ
・データ分析・Excel活用
・新規事業企画・立案
`;
        break;

      case 'optimize_education':
        prompt = `
学歴「${input}」をより魅力的に表現してください。

要求：
1. 正式な表記で記載
2. 専攻・研究内容があれば具体化
3. 成績・特記事項があれば追加
4. 関連する資格・活動があれば提案

出力形式：
最適化された学歴のみを返してください。

例：
入力：「○○大学卒業」
出力：「○○大学 経済学部経済学科 卒業（ゼミ：国際経済学専攻）」
`;
        break;

      case 'generate_summary':
        prompt = `
以下の情報から魅力的な自己PR・職務要約を作成してください。

年齢：${age}歳
職歴：${userInfo?.experience || input}
学歴：${userInfo?.education || ''}
スキル：${userInfo?.skills || ''}

要求：
1. 3-4行の簡潔な要約
2. 強みと経験を的確に表現
3. 転職市場での価値を明確化
4. 年齢に応じた表現レベル
5. 具体的な数字や成果を含める

出力形式：
自己PR文のみを返してください。
`;
        break;

      case 'improve_qualifications':
        prompt = `
資格「${input}」に加えて、${age}歳・職歴「${userInfo?.experience}」の人が取得すべき資格を提案してください。

要求：
1. 現在の職歴・年齢に関連する資格
2. キャリアアップに有効な資格
3. 業界で評価される資格
4. 実用性の高い資格
5. 取得難易度も考慮

出力形式：
おすすめ資格一覧を改行区切りで返してください。理由は簡潔に併記。

例：
・TOEIC 750点以上（国際業務対応力向上）
・基本情報技術者試験（デジタル基礎スキル証明）
・簿記2級（財務知識・管理能力向上）
`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return NextResponse.json({ 
        enhanced: content.text.trim(),
        success: true 
      });
    }

    return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 });

  } catch (error) {
    console.error('AI Enhancement error:', error);
    return NextResponse.json({ 
      error: 'AI処理でエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 