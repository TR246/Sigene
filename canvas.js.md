# HTML Canvas ラッパー "canvas.js"

## グローバル変数: Canvas

```js
new Canvas(argument);
```

引数: HTMLCanvasElement または セレクタ文字列
どちらでもないか、要素が見つからないとき(nullのとき)はエラー

## Canvas.Obj

```js
new Canvas.Obj({
    type,
    fill,
    stroke,
    "fill-top"
})
```

オプション

+ type: 以下のいずれか 大文字小文字は無視
    + "rect" 矩形
    + "circle" 円
    + "path" パス
+ fill: 色またはグラデーション [省略可] 初期値: 描画しない
+ stroke: 色またはグラデーション [省略可] 初期値: 描画しない
+ fill-top: fillを上に描画する [省略可] 初期値: strokeを上に描画

## Canvas.Grad

グラデーション