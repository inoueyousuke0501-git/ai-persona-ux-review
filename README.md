# AIペルソナUXレビュー

AIペルソナでUI案A/Bを比較し、実ユーザー調査前の仮説生成を支援するMVPデモです。

現在の公開デモは、架空の銀行アプリトップページA/Bを疑似アップロード済み素材として内蔵しています。社内機密画像や実顧客データは扱いません。

外部確認用URL:

- GitHub Pages: https://inoueyousuke0501-git.github.io/ai-persona-ux-review/
- Netlify: [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/inoueyousuke0501-git/ai-persona-ux-review)

## デモ起動

静的プロトタイプ:

```bash
node local-server.js
```

Next.js版:

```bash
npm install
npm run dev
```

## MVP

- 銀行アプリトップページA/B比較
- マス個人20人モード
- 疑似AI比較
- 結果サマリ表示
- ペルソナ別コメント表示
- 100人/1000人、シニア層/富裕層/法人担当者はUIのみ

## 企画書

社内AI部門への提案用PPTX:

`proposal/ai-persona-ux-review-proposal.pptx`

## 注意

このツールはユーザー調査の代替ではありません。AI出力は仮説生成の材料として扱います。
