# 学習ツール開発ガイド

この文書は、新しいチャットや開発者が、既存の公開構成とデザインを維持しながら
教材を追加・修正するための手引きです。

## 全体の流れ

```text
site/ の静的教材 ─────────┐
                          ├─ scripts/build-site.mjs ─ dist/ ─ GitHub Pages
独立アプリのビルド成果物 ─┘
```

`site/` は編集する公開ソース、`dist/` は生成結果です。`dist/` は直接編集しません。

## ローカルで公開内容を生成する

初回だけ依存パッケージをインストールします。

```bash
pnpm --dir period-flashcards install
```

公開内容を生成します。

```bash
pnpm --dir period-flashcards build
node --test tests/cancellation-third-parties.test.js
node --test tests/registration-route-scenarios.test.js
node scripts/build-site.mjs
```

生成された `dist/index.html` が公開サイトの入口です。HTTPで確認する場合は、例えば
次のように起動します。

```bash
python3 -m http.server 4173 --directory dist
```

ブラウザで `http://localhost:4173/` を開きます。

## 新しい静的教材を追加する

依存パッケージが不要な小さな教材は、この方法を選びます。

1. 英小文字とハイフンのslugを決める。例: `boundary-quiz`
2. `site/<slug>/index.html` を作る
3. 必要に応じて同じディレクトリへ `style.css` と `app.js` を置く
4. `site/index.html` の教材一覧へカードを追加する
5. 教材から `../` でトップページへ戻れるリンクを置く
6. `node scripts/build-site.mjs` を実行する
7. `dist/<slug>/` にコピーされ、両方向のリンクが動くことを確認する

`site/README.md` 以外の `site/` 配下は、組み立て時に自動的に `dist/` へコピーされます。

## ビルドが必要な教材を追加する

TypeScriptやパッケージ依存が必要な場合は、`period-flashcards/` と同様に独立させます。

1. リポジトリ直下に `<app-name>/` を作る
2. アプリ単独の `README.md` に起動、ビルド、データ追加方法を書く
3. GitHub Pagesのサブパスで動くよう、素材URLを相対パスにする
4. `scripts/build-site.mjs` に、生成物を `dist/<app-name>/` へコピーする処理を追加する
5. `.github/workflows/pages.yml` に、依存関係の導入とビルド処理を追加する
6. `site/index.html` の教材一覧へカードを追加する
7. リポジトリ全体の公開ビルドを確認する

ブラウザでHTMLを直接開く必要があるアプリでは、ES Moduleや `crossorigin` 属性が
`file://` で拒否されないかも確認します。ただし、GitHub Pages上の動作を優先します。

## デザイン方針

トップページと権利変動教材は、次の表現を基本にしています。

- 背景: 温かい生成り色
- 基調色: 深い青緑
- 強調色: 朱色
- 見出し: 明朝体を使い、本文との階層を明確にする
- 本文: ゴシック体を使い、小さな画面でも読みやすい行間を取る
- 装飾: 測量図や方眼紙を連想させる罫線、点線、幾何学形状
- 動き: 状態変化を理解するために使い、単なる装飾にはしない

既存の色を再利用するときは、まず `site/assets/site.css` と対象教材のCSSを確認します。
全教材を完全に同じ外観にする必要はありませんが、トップへ戻る導線、余白、読みやすさ、
強調色の意味は揃えます。

## 学習体験の方針

- 一画面または一操作で扱う論点を絞る
- 最初に事例の前提を明示する
- 操作後に、結論だけでなく理由を表示する
- 実体法上の状態と登記・手続上の状態を混同させない
- 間違えた理由を学べるフィードバックにする
- 途中状態へ戻れるようにする
- 法改正時に内容を探しやすいデータ構造を選ぶ

## 完了チェックリスト

### 内容

- [ ] 教材の対象論点と前提が明確である
- [ ] 根拠条文・出典・確認基準日が分かる
- [ ] 単純化や省略した例外が明記されている
- [ ] 学習用であり法的助言ではない旨がある

### 操作と表示

- [ ] トップページから教材へ移動できる
- [ ] 教材からトップページへ戻れる
- [ ] スマートフォン幅で横にはみ出さない
- [ ] キーボードだけでも主要操作ができる
- [ ] 色以外の文字や形でも状態を区別できる
- [ ] 動きを抑制するOS設定に対応している

### ビルド

- [ ] 各アプリ単独のビルドが成功する
- [ ] `node scripts/build-site.mjs` が成功する
- [ ] `dist/` に必要なHTML、CSS、JavaScriptが揃う
- [ ] 公開URLを想定した相対リンクが切れていない
- [ ] `git diff --check` が成功する

## 現在の公開URL構成

```text
/
├── registration-route/
├── civil-rights-transitions/
├── cancellation-third-parties/
├── inheritance-tree/
├── stair-floor-area/
├── dust-chute-floor-area/
└── period-flashcards/
```

新しい教材を追加したら、この一覧と `site/README.md` の構成例も更新します。
