![test](https://github.com/akashic-games/playground/workflows/test/badge.svg?branch=main)
![deploy](https://github.com/akashic-games/playground/workflows/deploy/badge.svg?branch=main)

<p align="center">
<img src="https://raw.githubusercontent.com/akashic-games/playground/main/img/akashic.png" />
</p>

# Akashic Playground

[website](https://akashic-games.github.io/playground/#/edit/default)

# development

## build

```sh
npm run build
```

## watch build

```sh
npm run dev
```

## update engine

以下のコマンドで、エンジンの新しいバージョンを検出して取り込みます。

```sh
npm run update-engines # エンジンファイルの更新
```

その後、手動で以下のコマンドを実行してください。

```sh
node scripts/generate_akashic_definitions.js 3.0.4 # akashic-engine@3.0.4 に更新する場合
```

# deploy

以下のコマンドで gh-pages 上にデプロイできます。

```sh
npm run deploy
```

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](./LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
