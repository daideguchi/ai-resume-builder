# 🚀 AI 履歴書・職務経歴書作成ツール

**Claude AI を活用した次世代の履歴書作成アプリケーション**

AI が自動で内容を最適化・補完して、プロフェッショナルな履歴書・職務経歴書を作成できます。

## ✨ 主な機能

### 🤖 **AI 補完機能**

- **職歴 AI 強化**: 「営業」→「新規顧客開拓営業として月平均 20 件の商談を実施、売上前年比 120%達成」
- **スキル自動提案**: 職歴から適切なスキルセットを推定・提案
- **自己 PR 自動生成**: 入力情報から魅力的な要約を自動作成
- **資格アドバイス**: キャリアに合った取得すべき資格を提案
- **学歴最適化**: より正式で魅力的な表現に変換

### 📝 **スマートな入力システム**

- **年齢計算ヘルパー**: 年齢から卒業年・就職年を自動計算
- **構造化入力**: ドロップダウン選択で簡単入力
- **複数エントリー対応**: 学歴・職歴を複数追加可能
- **リアルタイム補完**: 各フィールドで AI 最適化

### 📊 **エクスポート機能**

- **Excel 形式**: 履歴書・職務経歴書の 2 シート構成
- **CSV 形式**: スプレッドシートでの編集に対応
- **日本語対応**: BOM 付きで文字化け防止

### 🎨 **モダン UI/UX**

- **レスポンシブデザイン**: PC・スマホ対応
- **高コントラスト**: 読みやすさを重視した黒テキスト
- **セクション別色分け**: 直感的な操作が可能
- **ローディング状態**: AI 処理中の視覚的フィードバック

## 🛠️ 技術スタック

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Export**: xlsx, file-saver
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/ai-resume-builder.git
cd ai-resume-builder
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集して API キーを設定：

```bash
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 🔑 API キーの取得

1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. アカウント作成・ログイン
3. API キーを生成
4. `.env.local`ファイルに設定

## 📖 使用方法

### 1. **AI 入力フォーム**

- 年齢を設定すると重要な年度が自動計算
- 各セクションで基本情報を入力
- **AI ボタン**で内容を自動最適化

### 2. **プレビュー**

- 入力内容を履歴書・職務経歴書形式で確認
- 必要に応じてフォームに戻って修正

### 3. **エクスポート**

- Excel・CSV 形式でダウンロード
- ファイル名は自動生成（氏名\_日付.xlsx）

## 🎯 AI 補完の例

**入力例**: 「営業やってました」
**AI 補完**: 「新規顧客開拓営業として月平均 20 件の商談を実施。提案営業により売上前年比 120%を達成。チームリーダーとして新人 3 名の指導も担当。」

**スキル提案例**:

- 顧客折衝・営業スキル
- プロジェクトマネジメント
- チームリーダーシップ
- データ分析・Excel 活用
- 新規事業企画・立案

## 🚀 デプロイ

### Vercel でのデプロイ

1. **Vercel アカウントの準備**
2. **GitHub リポジトリの連携**
3. **環境変数の設定**
   - `ANTHROPIC_API_KEY` を設定
4. **自動デプロイ**

または、Deploy Button でワンクリックデプロイ：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-resume-builder)

## 📁 プロジェクト構造

```
src/
├── app/
│   ├── api/ai-enhance/          # AI補完API
│   ├── layout.tsx               # アプリケーションレイアウト
│   └── page.tsx                 # メインページ
├── components/
│   ├── SmartForm.tsx            # AI補完フォーム
│   ├── DocumentPreview.tsx      # 履歴書プレビュー
│   └── ExportOptions.tsx        # エクスポート機能
└── types/
    └── index.ts                 # TypeScript型定義
```

## 🤝 コントリビューション

1. このリポジトリを Fork
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチに Push (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🙋‍♂️ サポート

- バグ報告: [Issues](https://github.com/your-username/ai-resume-builder/issues)
- 機能要望: [Discussions](https://github.com/your-username/ai-resume-builder/discussions)
- 質問: [Q&A](https://github.com/your-username/ai-resume-builder/discussions/categories/q-a)

---

**Made with ❤️ by AI × Human Collaboration**
