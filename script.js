(() => {
    const TEXT_BLACK = "#1A1A1A";
    const FONT_JAPANESE = "'Mplus 1p', sans-serif";
    const FONT_HELVETICA = "'Helvetica', 'Arial', sans-serif";
    const FONT_FRUTIGER = "'Lato', 'Cabin', sans-serif";
    const FONT_CHINESE = "'Noto Sans SC', sans-serif";
    const FONT_KOREAN = "'Noto Sans KR', sans-serif";
    const SAVE_KEYS = ["size", "signType", "signBoard", "numbering", "branchRight", "branchLeft", "sta", "rightStations", "leftStations", "cityNotations", "routeColors"];
    const DEFAULT_DATA = '{"size":{"width":2250,"height":600},"signType":"jre-kanji","signBoard":{"type":"led","light":true},"numbering":true,"branchRight":false,"branchLeft":false,"sta":{"name":{"kanji":"新宿","english":"Shinjuku","kana":"しんじゅく","chinese":"新宿","korean":"신주쿠"},"enableTlc":true,"tlc":"SJK","numberings":[{"text":"JY 17","color":"#72C11D"}]},"rightStations":[{"name":{"kanji":"新大久保","english":"Shin-Ōkubo"},"lineColor":"#006400","go":false,"numberings":[{"text":"JY 16","color":"#72C11D"}]},{"name":{"kanji":"","english":""},"lineColor":"#006400","go":false,"numberings":[]}],"leftStations":[{"name":{"kanji":"代々木","english":"Yoyogi"},"lineColor":"#006400","go":true,"numberings":[{"text":"JY 18","color":"#72C11D"}]},{"name":{"kanji":"","english":""},"lineColor":"#006400","go":false,"numberings":[]}],"cityNotations":[{"text":"山","fill":false},{"text":"区","fill":true}],"routeColors":["#80C241"]}';

    //Canvas
    const contain = (width1, height1, width2, height2) => {
        //r1, r2は数値が大きいほど横長
        const r1 = width1 / height1;
        const r2 = width2 / height2;
        return r1 > r2?
            {width: r2 * height1, height: height1} : //親のほうが横長 高さをあわせる
            {width: width1, height: width1 / r2}; //子のほうが横長 幅をあわせる
    };

    //角丸四角系
    const roundRect = (ctx, x, y, width, height, r) => {
        ctx.beginPath();
        ctx.moveTo(x, y + r);
        ctx.arcTo(x, y, x + width - r, y, r);
        ctx.arcTo(x + width, y, x + width, y + height - r, r);
        ctx.arcTo(x + width, y + height, x + r, y + height, r);
        ctx.arcTo(x, y + height, x, y + r, r);
        ctx.closePath();
    };

    const frames = {
        none: {
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            draw(){},
            shadow(){}
        },
        floure: {
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            draw(ctx, width, height, scale, data){},
            shadow(ctx, width, height, scale, data){}
        },
        led: {
            padding: {
                top: 90,
                left: 70,
                right: 70,
                bottom: 37
            },
            draw(ctx, fw, fh, scale, data){
                //全体
                ctx.fillStyle = "#333";
                ctx.fillRect(0, 0, fw, fh);

                //周囲
                ctx.beginPath();
                ctx.moveTo(6, fh);
                ctx.lineTo(6, 6);
                ctx.lineTo(fw - 6, 6);
                ctx.lineTo(fw - 6, fh);
                ctx.lineWidth = 2;
                ctx.strokeStyle = TEXT_BLACK;
                ctx.stroke();

                //上部
                ctx.beginPath();
                ctx.moveTo(10, 6);
                ctx.lineTo(10, 90);
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(fw - 10, 6);
                ctx.lineTo(fw - 10, 90);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(6, 90);
                ctx.lineTo(fw - 6, 90);
                ctx.stroke();
                
                //下部
                const bGrad = ctx.createLinearGradient(0, fh, 0, fh - 8);
                bGrad.addColorStop(0, "rgba(0, 0, 0, 0.5)");
                bGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = bGrad;
                ctx.fillRect(7, fh - 8, fw - 14, 8);

                ctx.shadowColor = "#000";
                ctx.shadowBlur = 5;
                ctx.fillStyle = "#333";
                ctx.fillRect(10, fh - 37, fw - 20, 13);

                //本体
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
                ctx.shadowBlur = 0;
                ctx.fillStyle = data.signBoard.light? "#F8FAFF" : "#EEE";
                ctx.fillRect(70, 90, fw - 140, fh - 127);
            },
            shadow(ctx, fw, fh, scale, data){
                const width = fw - 140;
                const height = fh - 127;

                const tmp1 = document.createElement("canvas");
                const tCtx1 = tmp1.getContext("2d");

                tmp1.width = width;
                tmp1.height = height;

                tCtx1.fillStyle = "#FFF";
                tCtx1.fillRect(0, 0, width, height);

                //光1
                tCtx1.shadowColor = "#000";
                tCtx1.shadowBlur = 40;
                tCtx1.shadowOffsetY = height;
                tCtx1.fillStyle = "rgba(0, 0, 0, 0.5)";
                tCtx1.fillRect(30, 30 - height, width - 60, height - 60);
                //光2
                tCtx1.shadowBlur = 100;
                tCtx1.beginPath();
                tCtx1.moveTo(100, 100 - height);
                tCtx1.lineTo(width - 100, 100 - height);
                tCtx1.lineTo(width - 200, -200);
                tCtx1.lineTo(200, -200);
                tCtx1.closePath();
                tCtx1.fill();

                const tmp2 = document.createElement("canvas");
                const tCtx2 = tmp2.getContext("2d");

                tmp2.width = width;
                tmp2.height = height;

                tCtx2.fillStyle = "#000";
                tCtx2.fillRect(0, 0, width, height);

                const tImg1 = tCtx1.getImageData(0, 0, width, height);
                const tImg2 = tCtx2.getImageData(0, 0, width, height);

                const tImgData1 = tImg1.data;
                const tImgData2 = tImg2.data;

                for(let i = 0, len = width * height; i < len; i++){
                    tImgData2[i * 4 + 3] = (tImgData1[i * 4] - 63) * 0.2;
                }

                tCtx2.putImageData(tImg2, 0, 0);

                ctx.drawImage(tmp2, 70, 90);
            }
        },
        nonLight: {
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            draw(ctx, width, height, scale, data){},
            shadow(ctx, width, height, scale, data){}
        }
    };

    const drawContent = {
        "jre-kanji"(colorCtx, maskCtx, data){
            const {width, height} = data.size;
            const hw = width / 2;
            const hw_floor = Math.floor(hw);
            const hw_ceil = Math.ceil(hw);

            //緑線
            const lineY = height / 2 + 100; //線の中心Y位置
            const lineHeight = 120; //線の太さ
            const lineHeight_ceil = Math.ceil(lineHeight);
            const lineTop = lineY - lineHeight / 2; //線の上部Y位置
            const lineTop_floor = Math.floor(lineTop);
            const lineBottom = lineY + lineHeight / 2; //線の下部Y位置
            const branchStart = Math.min(780, hw - lineHeight);

            maskCtx.beginPath();
            if(data.branchRight){
                //右 分岐する
                maskCtx.moveTo(width - branchStart, lineTop);
                maskCtx.lineTo(width - branchStart + 80, lineTop - 80);

                if(data.rightStations[0].go){
                    //右上 尖らせる
                    maskCtx.lineTo(width - 160, lineTop - 80);
                    maskCtx.lineTo(width - 64, lineTop - 32);
                    maskCtx.lineTo(width - 160, lineTop + 16);
                }else{
                    //右上 尖らせない
                    maskCtx.lineTo(width, lineTop - 80);
                    maskCtx.lineTo(width, lineTop + 16);
                }

                maskCtx.lineTo(width - branchStart + 120, lineTop + 16);
                maskCtx.lineTo(width - branchStart + 76, lineY);
                maskCtx.lineTo(width - branchStart + 120, lineBottom - 16);

                if(data.rightStations[1].go){
                    //右下 尖らせる
                    maskCtx.lineTo(width - 160, lineBottom - 16);
                    maskCtx.lineTo(width - 64, lineBottom + 32);
                    maskCtx.lineTo(width - 160, lineBottom + 80);
                }else{
                    //右下 尖らせない
                    maskCtx.lineTo(width, lineBottom - 16);
                    maskCtx.lineTo(width, lineBottom + 80);
                }

                maskCtx.lineTo(width - branchStart + 80, lineBottom + 80);
                maskCtx.lineTo(width - branchStart, lineBottom);

            }else if(data.rightStations[0].go){
                //右 分岐しない 尖らせる
                maskCtx.moveTo(width - 200, lineTop);
                maskCtx.lineTo(width - 80, lineY);
                maskCtx.lineTo(width - 200, lineBottom);
            }else{
                //右 分岐しない 尖らせない
                maskCtx.moveTo(width, lineTop);
                maskCtx.lineTo(width, lineBottom);
            }
            
            if(data.branchLeft){
                //左 分岐する
                maskCtx.lineTo(branchStart, lineBottom);
                maskCtx.lineTo(branchStart - 80, lineBottom + 80);

                if(data.leftStations[1].go){
                    //左下 尖らせる
                    maskCtx.lineTo(160, lineBottom + 80);
                    maskCtx.lineTo(64, lineBottom + 32);
                    maskCtx.lineTo(160, lineBottom - 16);
                }else{
                    //左下 尖らせない
                    maskCtx.lineTo(0, lineBottom + 80);
                    maskCtx.lineTo(0, lineBottom - 16);
                }

                maskCtx.lineTo(branchStart - 120, lineBottom - 16);
                maskCtx.lineTo(branchStart - 76, lineY);
                maskCtx.lineTo(branchStart - 120, lineTop + 16);

                if(data.leftStations[0].go){
                    //左上 尖らせる
                    maskCtx.lineTo(160, lineTop + 16);
                    maskCtx.lineTo(64, lineTop - 32);
                    maskCtx.lineTo(160, lineTop - 80);
                }else{
                    //左上 尖らせない
                    maskCtx.lineTo(0, lineTop + 16);
                    maskCtx.lineTo(0, lineTop - 80);
                }

                maskCtx.lineTo(branchStart - 80, lineTop - 80);
                maskCtx.lineTo(branchStart, lineTop);
                
            }else if(data.leftStations[0].go){
                //左 分岐しない 尖らせる
                maskCtx.lineTo(200, lineBottom);
                maskCtx.lineTo(80, lineY);
                maskCtx.lineTo(200, lineTop);
            }else{
                //左 分岐しない 尖らせない
                maskCtx.lineTo(0, lineBottom);
                maskCtx.lineTo(0, lineTop);
            }

            maskCtx.closePath();
            maskCtx.lineWidth = 10;
            maskCtx.fill();

            //色塗り
            if(data.branchRight){
                //右 分岐する
                colorCtx.fillStyle = data.rightStations[0].lineColor;
                colorCtx.fillRect(hw_floor, lineTop_floor - 80, hw_ceil, 80 + lineHeight_ceil / 2);
                colorCtx.fillStyle = data.rightStations[1].lineColor;
                colorCtx.fillRect(hw_floor, lineY, hw_ceil, 80 + lineHeight_ceil / 2);
            }else{
                //右 分岐しない
                colorCtx.fillStyle = data.rightStations[0].lineColor;
                colorCtx.fillRect(hw_floor, lineTop_floor, hw_ceil, lineHeight_ceil);
            }
            if(data.branchLeft){
                //左 分岐する
                colorCtx.fillStyle = data.leftStations[0].lineColor;
                colorCtx.fillRect(0, lineTop_floor - 80, hw, 80 + lineHeight_ceil / 2);
                colorCtx.fillStyle = data.leftStations[1].lineColor;
                colorCtx.fillRect(0, lineY, hw, 80 + lineHeight_ceil / 2);
            }else{
                //左 分岐しない
                colorCtx.fillStyle = data.leftStations[0].lineColor;
                colorCtx.fillRect(0, lineTop_floor, hw, lineHeight_ceil);
            }
            //ラインカラー塗り
            const len = data.routeColors.length;
            const h = lineHeight / len;
            const x = hw - lineHeight / 2;
            for(let i = 0; i < len; i++){
                colorCtx.fillStyle = data.routeColors[i];
                colorCtx.fillRect(x, i? lineTop + h * i : lineTop_floor, lineHeight, Math.ceil(h));
            }

            //駅名
            const drawText = options => {
                const {x, y, text, weight, size, font, maxWidth, align} = options;
                maskCtx.textAlign = align || "center";
                maskCtx.font = `${weight || ""} ${size}px ${font}`;
                maskCtx.fillText(text, x, y, maxWidth);
                colorCtx.fillStyle = TEXT_BLACK;
                const textWidth = Math.min(maxWidth || Infinity, maskCtx.measureText(text).width);
                colorCtx.fillRect({left: x, right: x - textWidth}[align] || (x - textWidth / 2), y - size, textWidth, size * 1.22);
                maskCtx.textAlign = "center";
                return textWidth;
            };

            const insertSpace = (text, spaces) => text.split("").join(spaces[text.length - 2] || "");

            const drawNumbering = (x, y, size, text, color, tlc) => {
                const r = size * 0.1;
                const innerSize = size - 2 * r;
                const route = text.match(/[A-Z]{2}/g)[0];
                const number = text.match(/[0-9]{2}/g)[0];
                if(tlc){
                    //角丸正方形
                    roundRect(colorCtx, x, y, size, size, r);
                    colorCtx.fillStyle = color;
                    colorCtx.fill();
                }else{
                    //色塗り
                    colorCtx.fillStyle = color;
                    colorCtx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(size) + 1, Math.ceil(size) + 1);
                    //角丸正方形
                    roundRect(maskCtx, x, y, size, size, r);
                    maskCtx.fill();
                }
                //内側抜き
                maskCtx.fillStyle = "#000";
                maskCtx.fillRect(x + r, y + r, innerSize, innerSize);
                maskCtx.fillStyle = "#FFF";
                //テキスト
                colorCtx.fillStyle = TEXT_BLACK;
                colorCtx.fillRect(Math.ceil(x + r), Math.ceil(y + r), Math.floor(innerSize), Math.floor(innerSize));
                maskCtx.textAlign = "center";
                maskCtx.font = `bold ${r * 3}px 'Lato', 'Cabin', sans-serif`;
                maskCtx.fillText(route, x + size / 2, y + 4 * r);
                maskCtx.font = `bold ${r * 4.4}px 'Open Sans', sans-serif`;
                maskCtx.fillText(number, x + size / 2, y + 8 * r);
            };

            //漢字
            const kanjiWidth = drawText({
                x: hw,
                y: lineTop - 140,
                text: insertSpace(data.sta.name.kanji, ["　", " "]),
                weight: "800",
                size: 180,
                font: FONT_JAPANESE
            });
            //ひらがな
            drawText({
                x: hw,
                y: lineTop - 30,
                text: data.sta.name.kana,
                weight: "800",
                size: 60,
                font: FONT_JAPANESE
            });
            //英語
            const englishWidth = drawText({
                x: hw,
                y: lineBottom + 100,
                text: data.sta.name.english,
                weight: "bold",
                size: 80,
                font: FONT_HELVETICA
            });
            if(data.numbering){
                //4ヶ国語表記
                drawText({
                    x: hw + kanjiWidth / 2 + 80,
                    y: lineTop - 230,
                    text: data.sta.name.chinese,
                    size: 50,
                    font: FONT_CHINESE,
                    align: "left"
                });
                drawText({
                    x: hw + kanjiWidth / 2 + 80,
                    y: lineTop - 150,
                    text: data.sta.name.korean,
                    size: 50,
                    font: FONT_KOREAN,
                    align: "left"
                });

                //ナンバリング
                const len = data.sta.numberings.length;
                const tlc = data.sta.enableTlc;
                const tlcX = hw - kanjiWidth / 2 - 80 - 183.6*len;
                const scale = (tlcX < branchStart - 50) && data.branchLeft? (tlc? 1.4 : 1.7) : 1.7;
                if(tlc){
                    //スリーレターコード枠
                    const y = lineTop - 290;
                    const width = (108*len + 8) * scale;
                    const height = 142 * scale;
                    colorCtx.fillStyle = TEXT_BLACK;
                    colorCtx.fillRect(Math.floor(tlcX), Math.floor(y), Math.ceil(width) + 1, Math.ceil(height) + 1);
                    roundRect(maskCtx, tlcX, y, width, height, 18 * scale);
                    maskCtx.fill();
                    maskCtx.font = `bold ${32 * scale}px ${FONT_FRUTIGER}`;
                    maskCtx.fillStyle = "#000";
                    maskCtx.fillText(data.sta.tlc, tlcX + width / 2, y + 30 * scale);
                    maskCtx.fillStyle = "#FFF";
                }
                for(let i = 0; i < len; i++){
                    const i_ = len - i - 1;
                    const n = data.sta.numberings[i_];
                    drawNumbering(tlcX + 8 * scale + 108*scale*i_, lineTop - (tlc? 290 - 34*scale : 290), 100 * scale, n.text, n.color, tlc);
                }
            }

            const {branchRight, branchLeft} = data;
            //右駅名
            for(let i = 0, len = branchRight? 2 : 1; i < len; i++){
                const s = data.rightStations[i];
                const x = width - (branchRight? 160 : (s.go? 250 : 100));
                const maxWidth = Math.min(
                    x - (branchRight? width - branchStart + 80 : hw + lineHeight),
                    branchRight? x - width + branchStart - 120 : x - hw - englishWidth / 2 - 50);
                maskCtx.fillStyle = "#000";
                maskCtx.textAlign = "right";
                maskCtx.textBaseline = "middle";
                maskCtx.font = `500 ${branchRight? 70 : (s.go? 90 : 80)}px ${FONT_JAPANESE}`;
                maskCtx.fillText(insertSpace(s.name.kanji, [" "]), x, branchRight? [lineTop - 32, lineBottom + 32][i] : lineY, maxWidth);
                maskCtx.fillStyle = "#FFF";
                maskCtx.textBaseline = "alphabetic";
                drawText({
                    x,
                    y: branchRight? [lineTop + 66, lineBottom + 130][i] : lineBottom + 90,
                    text: s.name.english,
                    size: branchRight? 50 : 70,
                    font: FONT_HELVETICA,
                    align: "right",
                    maxWidth
                });
                const nSize = branchRight? 60 : 100;
                for(let j = 0, len = s.numberings.length; data.numbering && s.go && j < len; j++){
                    //ナンバリング
                    const n = s.numberings[j];
                    drawNumbering(width - (branchRight? 150 : 230) + nSize * 1.08 * j, branchRight? [lineTop + 12, lineBottom + 76][i] : lineBottom + 15, nSize, n.text, n.color);
                }
            }

            //左駅名
            for(let i = 0, len = branchLeft? 2 : 1; i < len; i++){
                const s = data.leftStations[i];
                const x = (branchLeft? 160 : (s.go? 250 : 100));
                const maxWidth = Math.min(
                    (branchLeft? branchStart - 80 : hw - lineHeight) - x,
                    branchLeft? branchStart + 120 - x : hw - englishWidth / 2 - 50 - x);
                maskCtx.fillStyle = "#000";
                maskCtx.textAlign = "left";
                maskCtx.textBaseline = "middle";
                maskCtx.font = `500 ${branchLeft? 70 : (s.go? 90 : 80)}px ${FONT_JAPANESE}`;
                maskCtx.fillText(insertSpace(s.name.kanji, [" "]), x, branchLeft? [lineTop - 32, lineBottom + 32][i] : lineY, maxWidth);
                maskCtx.fillStyle = "#FFF";
                maskCtx.textBaseline = "alphabetic";
                drawText({
                    x,
                    y: branchLeft? [lineTop + 66, lineBottom + 130][i] : lineBottom + 90,
                    text: s.name.english,
                    size: branchLeft? 50 : 70,
                    font: FONT_HELVETICA,
                    align: "left",
                    maxWidth
                });
                const nSize = branchLeft? 60 : 100;
                for(let j = 0, len = s.numberings.length; data.numbering && s.go && j < len; j++){
                    //ナンバリング
                    const n = s.numberings[j];
                    drawNumbering((branchLeft? 80 : 130) + nSize * 1.08 * (j - len + 1), branchLeft? [lineTop + 12, lineBottom + 76][i] : lineBottom + 15, nSize, n.text, n.color);
                }
            }
            maskCtx.textAlign = "center";

            //特定都区市内表記
            maskCtx.lineWidth = 4;
            maskCtx.textAlign = "center";
            for(let i = 0, len = data.cityNotations.length; i < len; i++){
                const n = data.cityNotations[len - i - 1];
                const x = width - 200 - 130 * i;
                const y = lineTop - (n.fill? 290 : 288);
                //色塗り
                colorCtx.fillStyle = TEXT_BLACK;
                colorCtx.fillRect(Math.floor(x), Math.floor(y), 101, 101);
                //角丸四角形
                roundRect(maskCtx, x, y, 100, 100, n.fill? 10 : 9);
                maskCtx[n.fill? "fill" : "stroke"]();
                //文字
                maskCtx.fillStyle = n.fill? "#000" : "#FFF";
                maskCtx.font = `bold 90px ${FONT_JAPANESE}`;
                maskCtx.fillText(n.text, x + 50, y + 85, 90);
            }
        }
    };

    //描画
    const canvas1 = document.getElementById("canvas1");
    const ctx1 = canvas1.getContext("2d");
    const $message = document.getElementById("message");

    const update = function(){
        //チェック
        if(!this.$el.checkValidity()){
            $message.classList.add("show");
            return;
        }
        $message.classList.remove("show");
        //保存
        const data = {};
        SAVE_KEYS.forEach(key => data[key] = this[key])
        localStorage.setItem("lastSaved", JSON.stringify(data));
        setTimeout(() => {
            const {size: {width, height}, signBoard} = this;

            const frame = frames[signBoard.type];
            const fp = frame.padding;

            const fw = width + fp.left + fp.right;
            const fh = height + fp.top + fp.bottom;
            
            const {width: _cw, height: _ch} = contain(document.body.clientWidth, window.innerHeight * 0.5, fw, fh);
            const cw = Math.floor(_cw) * devicePixelRatio;
            const ch = Math.floor(_ch) * devicePixelRatio;

            canvas1.width = cw;
            canvas1.height = ch;
            canvas1.style.width = _cw + "px";
            canvas1.style.height = _ch + "px";

            const scale = cw / fw;
            ctx1.scale(scale, scale);
            draw(ctx1, width, height, scale, this);
        }, 0);
    };

    //保存
    const saveAsPNG = function(){
        const canvas2 = document.createElement("canvas");
        const ctx2 = canvas2.getContext("2d");

        const frame = frames[this.signBoard.type];
        const fp = frame.padding;

        canvas2.width = this.size.width + fp.left + fp.right;
        canvas2.height = this.size.height + fp.top + fp.bottom;

        draw(ctx2, this.size.width, this.size.height, 1, this);

        const a = document.createElement("a");
        a.download = "駅名標_" + this.sta.name.kanji + ".png";
        a.href = canvas2.toDataURL();
        a.dispatchEvent(new MouseEvent("click"));
    };

    function draw(ctx, width, height, scale, data){
        const frame = frames[data.signBoard.type];
        const fp = frame.padding;

        const fw = width + fp.left + fp.right;
        const fh = height + fp.top + fp.bottom;

        frame.draw(ctx, fw, fh, scale, data);
        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        const colorCanvas = document.createElement("canvas");
        const maskCanvas = document.createElement("canvas");
        colorCanvas.width = width;
        colorCanvas.height = height;
        maskCanvas.width = width;
        maskCanvas.height = height;

        const colorCtx = colorCanvas.getContext("2d");
        const maskCtx = maskCanvas.getContext("2d");

        maskCtx.fillStyle = "#000";
        maskCtx.fillRect(0, 0, width, height);
        maskCtx.fillStyle = "#FFF";
        maskCtx.strokeStyle = "#FFF";
        drawContent[data.signType](colorCtx, maskCtx, data);

        const colorImg = colorCtx.getImageData(0, 0, width, height);
        const maskImg = maskCtx.getImageData(0, 0, width, height);
        const colorImgData = colorImg.data;
        const maskImgData = maskImg.data;
        for(let i = 0, len = width * height; i < len; i++){
            colorImgData[i * 4 + 3] = maskImgData[i * 4];
        }

        colorCtx.putImageData(colorImg, 0, 0);
        ctx.drawImage(colorCanvas, fp.left, fp.top);

        if(data.signBoard.light) frame.shadow(ctx, fw, fh, scale, data);
    }

    //Vue
    const replaceProperty = (obj, key, replacer) => {
        const keys = key.split(".");
        const last = keys.pop();
        const sObj = keys.reduce((obj, key) => obj[key.trim()], obj);
        sObj[last] = replacer(sObj[last]);
    };
    const vm = new Vue({
        el: "#vm",
        //mounted: update,
        mounted(){
            const lastSaved = JSON.parse(localStorage.getItem("lastSaved"));
            if(lastSaved){
                SAVE_KEYS.forEach(key => this[key] = lastSaved[key]);
            }else{
                localStorage.setItem("lastSaved", DEFAULT_DATA);
            }
            this.update();
            this.loadFont('japanese');
            this.loadFont('chinese');
            this.loadFont('korean');
        },
        data: {
            macrons: ["Ā", "Ē", "Ī", "Ō", "Ū", "ā", "ē", "ī", "ō", "ū"],
            fontLoad: {
                japanese: false,
                chinese: false,
                korean: false
            },
            size: {
                width: 2250,
                height: 600
            },
            signType: "jre-kanji",
            signBoard: {
                type: "led",
                light: true
            },
            numbering: true,
            branchRight: false,
            branchLeft: false,
            sta: {
                name: {
                    kanji: "新宿",
                    english: "Shinjuku",
                    kana: "しんじゅく",
                    chinese: "新宿",
                    korean: "신주쿠"
                },
                enableTlc: true,
                tlc: "SJK",
                numberings: [{
                    text: "JY 17",
                    color: "#72C11D"
                }]
            },
            rightStations: [
                {
                    name: {
                        kanji: "新大久保",
                        english: "Shin-Ōkubo"
                    },
                    lineColor: "#006400",
                    go: false,
                    numberings: [{
                        text: "JY 16",
                        color: "#72C11D"
                    }]
                },
                {
                    name: {
                        kanji: "",
                        english: ""
                    },
                    lineColor: "#006400",
                    go: false,
                    numberings: []
                }
            ],
            leftStations: [
                {
                    name: {
                        kanji: "代々木",
                        english: "Yoyogi"
                    },
                    lineColor: "#006400",
                    go: true,
                    numberings: [{
                        text: "JY 18",
                        color: "#72C11D"
                    }]
                },
                {
                    name: {
                        kanji: "",
                        english: ""
                    },
                    lineColor: "#006400",
                    go: false,
                    numberings: []
                }
            ],
            cityNotations: [{
                text: "山",
                fill: false
            }, {
                text: "区",
                fill: true
            }],
            routeColors: ["#80C241"]
        },
        computed: {
            enableBoardLight(){
                return ["floure", "led"].includes(this.signBoard.type);
            }
        },
        methods: {
            loadFont(lang){
                const self = this;
                const config = {
                    japanese: {
                        families: ["Mplus 1p:n5,n8"],
                        urls: ["https://fonts.googleapis.com/earlyaccess/mplus1p.css"]
                    },
                    chinese: {
                        families: ["Noto Sans SC:n4"],
                        urls: ["https://fonts.googleapis.com/earlyaccess/notosanssc.css"]
                    },
                    korean: {
                        families: ["Noto Sans KR:n4"],
                        urls: ["https://fonts.googleapis.com/earlyaccess/notosanskr.css"]
                    }
                };
                WebFont.load({
                    custom: config[lang],
                    loading(){
                        self.fontLoad[lang] = true;
                    },
                    active(){
                        self.update();
                    },
                    inactive(){
                        self.fontLoad[lang] = false;
                    }
                });
            },
            changeBoardType(){
                if(!this.enableBoardLight)
                    this.signBoard.light = false;
            },
            formatUppercase(v){
                return v.replace(/[Ａ-Ｚａ-ｚ０-９]/g,
                    c => String.fromCharCode(c.charCodeAt(0) - 65248))
                    .toUpperCase();
            },
            reset(){
                localStorage.removeItem("lastSaved");
                localStorage.setItem("lastSaved", DEFAULT_DATA);
                lastSaved = JSON.parse(DEFAULT_DATA);
                SAVE_KEYS.forEach(key => this[key] = lastSaved[key]);
            },
            saveAsPNG, update
        }
    });

    //ウェブフォント
    WebFont.load({
        google: {
            families: ["Open+Sans:700&text=0123456789MS", "Lato:700&text=ABDEFGHIJLMNOPQRSTUVWXYZ", "Cabin:700&text=CK"]
        },
        active(){
            update.call(vm);
        }
    });

    //リサイズ
    let eventTimer = 0;
    window.addEventListener("resize", () => {
        clearTimeout(eventTimer);
        eventTimer = setTimeout(() => update.call(vm), 300);
    });
})();