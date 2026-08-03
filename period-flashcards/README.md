# 期間フラッシュカード

土地家屋調査士試験で問われる保存期間などの数字知識を反復学習する、静的HTMLアプリです。

全問題をランダムな順番で一巡してから、次の周回へ進みます。

## キーボード操作

- `1`〜`9`: 表示された番号の選択肢に回答
- `Enter` または `Space`: 回答後に次の問題へ進む

## 開発環境

- Node.js
- pnpm

## 起動方法

```bash
pnpm install
pnpm dev
```

本番用ファイルは次のコマンドで `dist/` に生成されます。

```bash
pnpm build
```

生成後のファイルは通信なしで利用できます。ローカルで確認する場合は `pnpm preview` を実行します。
`dist/index.html` をブラウザで直接開くこともできます。

リポジトリ全体のGitHub Pagesを組み立てると、公開サイトの
`/period-flashcards/` にこの生成物が配置されます。

## 問題の追加方法

`src/questions.ts` の `questions` 配列へ `Question` 型のオブジェクトを追加します。

```typescript
{
  id: "一意なID",
  category: "保存期間",
  prompt: "問題文",
  choices: ["永久", "50年", "30年"],
  correctChoice: "50年",
  explanation: "回答後に表示する解説",
  source: "根拠法令",
  tags: ["検索用タグ"]
}
```

問題を追加・修正するときは、根拠法令の最新条文を確認してください。
