(() => {
    const FONT_JAPANESE = "'Mplus 1p', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'M+ 1p', sans-serif";
    const FONT_HELVETICA = "'Helvetica', 'Arial', sans-serif";
    const FONT_FRUTIGER = "Cabin', 'Open Sans', 'Lato', 'sans-serif";
    const FONT_CHINESE = "'Noto Sans SC', sans-serif";
    const FONT_KOREAN = "'Noto Sans KR', sans-serif";
    const defaultData = () => ({
        signType: "jre-kanji",
        signBoard: {
            type: "SE-6",
            light: true
        },
        numbering: true,
        branchRight: false,
        branchLeft: false,
        black: "#1A1A1A",
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
    });

    //離脱確認
    window.addEventListener("beforeunload", e => e.returnValue = "このページから離れてもよろしいですか");

    //専用フォーマット
    const desig1 = {
        stringify(data){
            //文字列化
            const strLength = str => str.length + ":" + str;
            const stringifyNumberings = numberings => numberings.length  + ":" + numberings.map(n => n.text + "," + n.color.slice(1) + ";").join("");
            let rtn = "";
            const {numbering, branchRight, branchLeft, sta, cityNotations, routeColors} = data;
            rtn += data.signType + ",";
            rtn += data.signBoard.type + ",";
            rtn += data.signBoard.light? "1" : "0";
            rtn += numbering? "1" : "0";
            rtn += branchRight? "1" : "0";
            rtn += branchLeft? "1" : "0";
            rtn += data.black.slice(1);
            rtn += strLength(sta.name.kanji);
            rtn += strLength(sta.name.english);
            rtn += strLength(sta.name.kana);
            if(numbering){
                rtn += strLength(sta.name.chinese);
                rtn += strLength(sta.name.korean);
                rtn += sta.enableTlc? "1" + sta.tlc : "0";
                rtn += stringifyNumberings(sta.numberings);
            }

            ssta(data.rightStations[0]);
            if(branchRight){
                ssta(data.rightStations[1]);
            }
            ssta(data.leftStations[0]);
            if(branchLeft){
                ssta(data.leftStations[1]);
            }

            function ssta(sta){
                rtn += strLength(sta.name.kanji);
                rtn += strLength(sta.name.english);
                rtn += sta.lineColor.slice(1);
                rtn += sta.go? "1" : "0";
                if(numbering && sta.go){
                    rtn += stringifyNumberings(sta.numberings);
                }
            }

            rtn += cityNotations.length + ":" + cityNotations.map(n => n.text + (n.fill? "1" : "0")).join("");
            rtn += routeColors.length + ":" + routeColors.map(color => color.slice(1)).join("");

            return rtn;
        },
        parse(str){
            //パース
            let current = 0;
            
            const parseLengthStr = pos => {
                const colon = str.indexOf(":", pos);
                const len = str.slice(pos, colon) - 0;
                current = colon + len + 1;
                return str.substr(colon + 1, len);
            };
            const parseNumberings = pos => {
                const colon = str.indexOf(":", pos);
                const len = str.slice(pos, colon) - 0;
                const rtn = [];
                current = colon + 1;
                for(let i = 0; i < len; i++){
                    const semColon = str.indexOf(";", current);
                    const [text, color] =  str.slice(current, semColon).split(",");
                    rtn.push({text, color: "#" + color});
                    current = semColon + 1;
                }
                return rtn;
            };
            const data = defaultData();
            
            const signTypePos = str.indexOf(",");
            data.signType = str.slice(0, signTypePos);
            current = signTypePos + 1;

            const signBoardTypePos = str.indexOf(",", current);
            data.signBoard.type = str.slice(current, signBoardTypePos);
            current = signBoardTypePos + 1;
            data.signBoard.light = Boolean(str[current] - 0);

            const numbering = Boolean(str[++current] - 0);
            data.numbering = numbering;

            const branchRight = Boolean(str[++current] - 0);
            data.branchRight = branchRight;

            const branchLeft = Boolean(str[++current] - 0);
            data.branchLeft = branchLeft;

            data.black = "#" + str.substr(++current, 6);
            current += 6;

            data.sta.name.kanji = parseLengthStr(current);
            data.sta.name.english = parseLengthStr(current);
            data.sta.name.kana = parseLengthStr(current);
            if(numbering){
                data.sta.name.chinese = parseLengthStr(current);
                data.sta.name.korean = parseLengthStr(current);

                const tlc = Boolean(str[current++] - 0);
                data.sta.enableTlc = tlc;

                if(tlc){
                    data.sta.tlc = str.substr(current, 3);
                    current += 3;
                }else{
                    data.sta.tlc = "";
                }

                data.sta.numberings = parseNumberings(current);
            }else{
                data.sta.chinese = "";
                data.sta.korean = "";

                data.sta.enableTlc = false;

                data.sta.tlc = "";

                data.sta.numberings = [];
            }

            ssta(data.rightStations[0]);
            if(branchRight){
                ssta(data.rightStations[1]);
            }
            ssta(data.leftStations[0]);
            if(branchLeft){
                ssta(data.leftStations[1]);
            }

            function ssta(sta){
                sta.name.kanji = parseLengthStr(current);
                sta.name.english = parseLengthStr(current);

                sta.lineColor = "#" + str.substr(current, 6);
                current += 6;

                const go = Boolean(str[current++] - 0);
                sta.go = go;

                if(numbering && go){
                    sta.numberings = parseNumberings(current);
                }else{
                    sta.numberings = [];
                }
            }

            data.cityNotations = [];
            const ccolon = str.indexOf(":", current);
            const clen = str.slice(current, ccolon) - 0;
            current = ccolon + 1;
            for(let i = 0; i < clen; i++){
                data.cityNotations.push({
                    text: str[current],
                    fill: Boolean(str[current + 1] - 0)
                });
                current += 2;
            }

            data.routeColors = [];
            const rccolon = str.indexOf(":", current);
            const rclen = str.slice(current, rccolon) - 0;
            current = rccolon + 1;
            for(let i = 0; i < rclen; i++){
                data.routeColors.push("#" + str.substr(current, 6));
                current += 6;
            }

            return data;
        }
    }

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

    //------------------------------SE型枠------------------------------
    const seFrame = {
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
            ctx.strokeStyle = "#1A1A1A";
            ctx.stroke();

            //上部
            ctx.beginPath();
            ctx.moveTo(10, 6);
            ctx.lineTo(10, this.padding.top);
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(fw - 10, 6);
            ctx.lineTo(fw - 10, this.padding.top);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(6, this.padding.top);
            ctx.lineTo(fw - 6, this.padding.top);
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
            ctx.fillRect(10, fh - this.padding.bottom, fw - 20, 10);

            //本体
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
            ctx.shadowBlur = 0;
            ctx.fillStyle = data.signBoard.light? "#F0F8FF" : "#EEE";
            ctx.fillRect(this.padding.left, this.padding.top, fw - this.padding.left - this.padding.right, fh - this.padding.top - this.padding.bottom);
        },
        shadow(ctx, fw, fh, scale, data){
            const width = fw - this.padding.left - this.padding.right;
            const height = fh - this.padding.top - this.padding.bottom;

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

            ctx.drawImage(tmp2, this.padding.left, this.padding.top);
        }
    };
    //------------------------------枠設定------------------------------
    const frames = {
        "SE-6": {
            padding: {
                top: 80,
                bottom: 30,
                left: 35,
                right: 35
            },
            width: 1830,
            height: 490,
            draw: seFrame.draw,
            shadow: seFrame.shadow
        },
        "SE-7": {
            padding: {
                top: 80,
                bottom: 30,
                left: 35,
                right: 35
            },
            width: 2410,
            height: 490,
            draw: seFrame.draw,
            shadow: seFrame.shadow
        },
        "SE-8": {
            padding: {
                top: 80,
                bottom: 30,
                left: 40,
                right: 40
            },
            width: 3620,
            height: 490,
            draw: seFrame.draw,
            shadow: seFrame.shadow
        }
    };

    //------------------------------中身を描く------------------------------
    const drawContent = {
        "jre-kanji"(colorCtx, maskCtx, data){
            const {width, height} = frames[data.signBoard.type];
            const hw = width / 2;
            const hw_floor = Math.floor(hw);
            const hw_ceil = Math.ceil(hw);

            //緑線
            const lineY = height / 2 + 80; //線の中心Y位置
            const lineHeight = 100; //線の太さ
            const lineHeight_ceil = Math.ceil(lineHeight);
            const lineTop = lineY - lineHeight / 2; //線の上部Y位置
            const lineTop_floor = Math.floor(lineTop);
            const lineBottom = lineY + lineHeight / 2; //線の下部Y位置
            const branchStart = Math.min(620, hw - lineHeight);

            maskCtx.beginPath();
            if(data.branchRight){
                //右 分岐する
                maskCtx.moveTo(width - branchStart, lineTop);
                maskCtx.lineTo(width - branchStart + 65, lineTop - 65);

                if(data.rightStations[0].go){
                    //右上 尖らせる
                    maskCtx.lineTo(width - 130, lineTop - 65);
                    maskCtx.lineTo(width - 50, lineTop - 25);
                    maskCtx.lineTo(width - 130, lineTop + 12);
                }else{
                    //右上 尖らせない
                    maskCtx.lineTo(width, lineTop - 65);
                    maskCtx.lineTo(width, lineTop + 12);
                }

                maskCtx.lineTo(width - branchStart + 100, lineTop + 12);
                maskCtx.lineTo(width - branchStart + 60, lineY);
                maskCtx.lineTo(width - branchStart + 100, lineBottom - 12);

                if(data.rightStations[1].go){
                    //右下 尖らせる
                    maskCtx.lineTo(width - 130, lineBottom - 12);
                    maskCtx.lineTo(width - 50, lineBottom + 25);
                    maskCtx.lineTo(width - 130, lineBottom + 65);
                }else{
                    //右下 尖らせない
                    maskCtx.lineTo(width, lineBottom - 12);
                    maskCtx.lineTo(width, lineBottom + 65);
                }

                maskCtx.lineTo(width - branchStart + 65, lineBottom + 65);
                maskCtx.lineTo(width - branchStart, lineBottom);

            }else if(data.rightStations[0].go){
                //右 分岐しない 尖らせる
                maskCtx.moveTo(width - 160, lineTop);
                maskCtx.lineTo(width - 65, lineY);
                maskCtx.lineTo(width - 160, lineBottom);
            }else{
                //右 分岐しない 尖らせない
                maskCtx.moveTo(width, lineTop);
                maskCtx.lineTo(width, lineBottom);
            }
            
            if(data.branchLeft){
                //左 分岐する
                maskCtx.lineTo(branchStart, lineBottom);
                maskCtx.lineTo(branchStart - 65, lineBottom + 65);

                if(data.leftStations[1].go){
                    //左下 尖らせる
                    maskCtx.lineTo(130, lineBottom + 65);
                    maskCtx.lineTo(50, lineBottom + 25);
                    maskCtx.lineTo(130, lineBottom - 12);
                }else{
                    //左下 尖らせない
                    maskCtx.lineTo(0, lineBottom + 65);
                    maskCtx.lineTo(0, lineBottom - 12);
                }

                maskCtx.lineTo(branchStart - 100, lineBottom - 12);
                maskCtx.lineTo(branchStart - 60, lineY);
                maskCtx.lineTo(branchStart - 100, lineTop + 12);

                if(data.leftStations[0].go){
                    //左上 尖らせる
                    maskCtx.lineTo(130, lineTop + 12);
                    maskCtx.lineTo(50, lineTop - 25);
                    maskCtx.lineTo(130, lineTop - 65);
                }else{
                    //左上 尖らせない
                    maskCtx.lineTo(0, lineTop + 12);
                    maskCtx.lineTo(0, lineTop - 65);
                }

                maskCtx.lineTo(branchStart - 65, lineTop - 65);
                maskCtx.lineTo(branchStart, lineTop);
                
            }else if(data.leftStations[0].go){
                //左 分岐しない 尖らせる
                maskCtx.lineTo(160, lineBottom);
                maskCtx.lineTo(65, lineY);
                maskCtx.lineTo(160, lineTop);
            }else{
                //左 分岐しない 尖らせない
                maskCtx.lineTo(0, lineBottom);
                maskCtx.lineTo(0, lineTop);
            }

            maskCtx.closePath();
            maskCtx.fill();

            //色塗り
            if(data.branchRight){
                //右 分岐する
                colorCtx.fillStyle = data.rightStations[0].lineColor;
                colorCtx.fillRect(hw_floor, lineTop_floor - 65, hw_ceil, 65 + lineHeight_ceil / 2);
                colorCtx.fillStyle = data.rightStations[1].lineColor;
                colorCtx.fillRect(hw_floor, lineY, hw_ceil, 65 + lineHeight_ceil / 2);
            }else{
                //右 分岐しない
                colorCtx.fillStyle = data.rightStations[0].lineColor;
                colorCtx.fillRect(hw_floor, lineTop_floor, hw_ceil, lineHeight_ceil);
            }
            if(data.branchLeft){
                //左 分岐する
                colorCtx.fillStyle = data.leftStations[0].lineColor;
                colorCtx.fillRect(0, lineTop_floor - 65, hw, 65 + lineHeight_ceil / 2);
                colorCtx.fillStyle = data.leftStations[1].lineColor;
                colorCtx.fillRect(0, lineY, hw, 65 + lineHeight_ceil / 2);
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
                colorCtx.fillStyle = data.black;
                const textWidth = Math.min(maxWidth || Infinity, maskCtx.measureText(text).width);
                colorCtx.fillRect({left: x, right: x - textWidth}[align] || (x - textWidth / 2), y - size, textWidth, size * 1.22);
                maskCtx.textAlign = "center";
                return Math.min(textWidth, maxWidth || Infinity);
            };
            const measureText = options => {
                const {text, weight, size, font, maxWidth} = options;
                maskCtx.font = `${weight || ""} ${size}px ${font}`;
                const textWidth = Math.min(maxWidth || Infinity, maskCtx.measureText(text).width);
                return Math.min(textWidth, maxWidth || Infinity);
            };

            const insertSpace = (text, spaces) => text.split("").join(spaces[text.length - 2] || "");

            const drawNumbering = (x, y, size, text, color, tlc) => {
                const r = size * 0.1;
                const innerSize = size - 2 * r;
                const route = text.match(/[A-Z]+/g)[0];
                const number = text.match(/[0-9]{2,}/g)[0];
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
                colorCtx.fillStyle = data.black;
                colorCtx.fillRect(Math.ceil(x + r) + 2, Math.ceil(y + r) + 2, Math.floor(innerSize) - 4, Math.floor(innerSize) - 4);
                maskCtx.textAlign = "center";
                maskCtx.font = `bold ${r * 3}px ${FONT_FRUTIGER}`;
                maskCtx.fillText(route, x + size / 2, y + 4 * r, innerSize * 0.9);
                maskCtx.font = `bold ${r * 4.4}px ${FONT_FRUTIGER}`;
                maskCtx.fillText(number, x + size / 2, y + 8 * r, innerSize * 0.9);
            };

            //漢字
            const kanjiWidth = drawText({
                x: hw,
                y: lineTop - 120,
                text: insertSpace(data.sta.name.kanji, ["　", " "]),
                weight: "800",
                size: 150,
                font: FONT_JAPANESE
            });
            //ひらがな
            drawText({
                x: hw,
                y: lineTop - 40,
                text: data.sta.name.kana,
                weight: "800",
                size: 50,
                font: FONT_JAPANESE
            });
            //英語
            const englishWidth = drawText({
                x: hw,
                y: lineBottom + 80,
                text: data.sta.name.english,
                weight: "bold",
                size: 65,
                font: FONT_HELVETICA
            });
            //maxWidth: (data.branchRight || data.branchLeft)? width - branchStart * 2 : width / 2
            if(data.numbering){
                //4ヶ国語表記
                drawText({
                    x: hw + kanjiWidth / 2 + 65,
                    y: lineTop - 195,
                    text: data.sta.name.chinese,
                    size: 50,
                    font: FONT_CHINESE,
                    align: "left"
                });
                drawText({
                    x: hw + kanjiWidth / 2 + 65,
                    y: lineTop - 120,
                    text: data.sta.name.korean,
                    size: 50,
                    font: FONT_KOREAN,
                    align: "left"
                });

                //ナンバリング
                const tlc = data.sta.enableTlc;
                const nbLen = data.sta.numberings.length;
                const tlcX = Math.max(25, hw - kanjiWidth / 2 - 80 - 183.6*nbLen);
                const scale = (tlcX < branchStart - 50) && data.branchLeft && tlc? 1.2 : 1.5;
                if(tlc){
                    //スリーレターコード枠
                    const y = lineTop - 250;
                    const width = (108*nbLen + 8) * scale;
                    const height = 142 * scale;
                    colorCtx.fillStyle = data.black;
                    colorCtx.fillRect(Math.floor(tlcX), Math.floor(y), Math.ceil(width) + 1, Math.ceil(height) + 1);
                    roundRect(maskCtx, tlcX, y, width, height, 18 * scale);
                    maskCtx.fill();
                    maskCtx.font = `bold ${32 * scale}px ${FONT_FRUTIGER}`;
                    maskCtx.fillStyle = "#000";
                    maskCtx.fillText(data.sta.tlc, tlcX + width / 2, y + 30 * scale);
                    maskCtx.fillStyle = "#FFF";
                }
                for(let i = 0; i < nbLen; i++){
                    const i_ = nbLen - i - 1;
                    const n = data.sta.numberings[i_];
                    drawNumbering(tlcX + 8 * scale + 108*scale*i_, lineTop - (tlc? 250 - 34*scale : 250), 100 * scale, n.text, n.color, tlc);
                }
            }

            //左右駅名
            const sideStation = (branch, stations, align) => {
                const isRight = align === "right";
                const cxw = isRight? (v => width - v) : (v => v);
                for(let i = 0, len = branch? 2 : 1; i < len; i++){
                    const s = stations[i];
                    const x = cxw(branch? 130 : (s.go? 200 : 80));
                    const maxWidth = Math.min(
                        Math.abs(x - (isRight? hw + englishWidth / 2 : hw - englishWidth / 2)) - 20,
                        branch? Math.abs(x - (isRight? width - branchStart + 100 : branchStart - 100)) : Infinity);
                    maskCtx.fillStyle = "#000";
                    maskCtx.textAlign = align;
                    maskCtx.textBaseline = "middle";
                    maskCtx.font = `500 ${branch? 60 : (s.go? 80 : 70)}px ${FONT_JAPANESE}`;
                    maskCtx.fillText(insertSpace(s.name.kanji, [" "]), x, branch? [lineTop - 25, lineBottom + 25][i] : lineY, maxWidth);
                    maskCtx.fillStyle = "#FFF";
                    maskCtx.textBaseline = "alphabetic";
                    drawText({
                        x,
                        y: branch? [lineTop - 25, lineBottom + 25][i] + 80 : lineBottom + 70,
                        text: s.name.english,
                        size: branch? 40 : 55,
                        font: FONT_HELVETICA,
                        align, maxWidth
                    });
                    const nSize = branch? 50 : 80;
                    for(let j = 0, len = s.numberings.length; data.numbering && s.go && j < len; j++){
                        //ナンバリング
                        const n = s.numberings[j];
                        drawNumbering(cxw(branch? 120 : 180) + nSize*1.08*j + (isRight? 0 : -nSize*1.08*len), branch? [lineTop - 25, lineBottom + 25][i] + 36 : lineBottom + 15, nSize, n.text, n.color);
                    }
                }
            };

            sideStation(data.branchRight, data.rightStations, "right");
            sideStation(data.branchLeft, data.leftStations, "left");
            maskCtx.textAlign = "center";

            //特定都区市内表記
            maskCtx.lineWidth = 4;
            maskCtx.textAlign = "center";
            for(let i = 0, len = data.cityNotations.length; i < len; i++){
                const n = data.cityNotations[len - i - 1];
                const x = width - 160 - 100 * i;
                const y = lineTop - (n.fill? 230 : 228);
                //色塗り
                colorCtx.fillStyle = data.black;
                colorCtx.fillRect(Math.floor(x) - 3, Math.floor(y) - 3, 86, 86);
                //角丸四角形
                roundRect(maskCtx, x, y, 80, 80, n.fill? 8 : 7);
                maskCtx[n.fill? "fill" : "stroke"]();
                //文字
                maskCtx.fillStyle = n.fill? "#000" : "#FFF";
                maskCtx.font = `bold 70px ${FONT_JAPANESE}`;
                maskCtx.fillText(n.text, x + 40, y + 65, 75);
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
        localStorage.setItem("lastSaved", LZString.compressToEncodedURIComponent(desig1.stringify(this)));

        //描画処理
        setTimeout(() => {
            const {signBoard} = this;

            const frame = frames[signBoard.type];
            const fp = frame.padding;

            const fw = frame.width + fp.left + fp.right;
            const fh = frame.height + fp.top + fp.bottom;
            
            const {width: _cw, height: _ch} = contain(document.body.clientWidth, window.innerHeight * 0.5, fw, fh);
            const cw = Math.floor(_cw) * devicePixelRatio;
            const ch = Math.floor(_ch) * devicePixelRatio;

            canvas1.width = cw;
            canvas1.height = ch;
            canvas1.style.width = _cw + "px";
            canvas1.style.height = _ch + "px";

            const scale = cw / fw;
            ctx1.scale(scale, scale);
            draw(ctx1, frame.width, frame.height, scale, this);
        }, 0);
    };

    //保存
    const saveAsPNG = function(){
        const canvas2 = document.createElement("canvas");
        const ctx2 = canvas2.getContext("2d");

        const frame = frames[this.signBoard.type];
        const fp = frame.padding;

        canvas2.width = frame.width + fp.left + fp.right;
        canvas2.height = frame.height + fp.top + fp.bottom;

        draw(ctx2, frame.width, frame.height, 1, this);

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
    const vm = new Vue({
        el: "#vm",
        mounted(){
            const lastSaved = localStorage.getItem("lastSaved");
            let openData;
            if(location.search.match(/\?desig1=/)){
                //URLパラメーターがdesig1フォーマットなら
                openData = desig1.parse(LZString.decompressFromEncodedURIComponent(location.search.slice(8)));
            }else if(lastSaved){
                //URLパラメーターがなければ
                openData = desig1.parse(LZString.decompressFromEncodedURIComponent(lastSaved));
            }

            if(openData){
                Object.keys(openData).forEach(key => this[key] = openData[key]);
            }

            this.update();
        },
        data: () => Object.assign(defaultData(), {
            macrons: ["Ā", "Ē", "Ī", "Ō", "Ū", "ā", "ē", "ī", "ō", "ū"],
            fontLoad: {
                japanese: false,
                chinese: false,
                korean: false
            },
            shareURL: "",
            blackList: [
                {color: "#1A1A1A", name: "黒"},
                {color: "#333333", name: "初期灰色"}
            ],
            cp1: "#000000",
            cp2: "#FFFFFF",
            numberingColorList: [
                {color: "#F0862B", name: "東海道線"},
                {color: "#1069B4", name: "横須賀・総武快速線"},
                {color: "#1DAED1", name: "京浜東北・根岸線"},
                {color: "#B3CC36", name: "山手線"},
                {color: "#DD6935", name: "中央線快速・青梅線・五日市線"},
                {color: "#F2D01F", name: "中央・総武線各駅停車"},
                {color: "#F18E41", name: "宇都宮線・高崎線"},
                {color: "#14A676", name: "埼京線"},
                {color: "#1DAF7E", name: "常磐線快速"},
                {color: "#868587", name: "常磐線各駅停車"},
                {color: "#D01827", name: "京葉線"},
                {color: "#DB2027", name: "湘南新宿ライン"},
                {color: "#B1CB39", name: "横浜線"},
                {color: "#F2D01F", name: "南武線"},
                {color: "#F2D01F", name: "鶴見線"},
                {color: "#EB5A28", name: "武蔵野線"}
            ],
            routeColorList: [
                {color: "#80C241", name: "山手線"},
                {color: "#00B48D", name: "埼京線・川越線"},
                {color: "#00B2E5", name: "京浜東北・根岸線"},
                {color: "#F15A22", name: "中央線快速・青梅線・五日市線"},
                {color: "#FFD400", name: "中央総武線各駅停車"},
                {color: "#00B261", name: "常磐線・成田線"},
                {color: "#C9242F", name: "京葉線"},
                {color: "#F15A22", name: "武蔵野線"},
                {color: "#FFD400", name: "南武線"},
                {color: "#FFD400", name: "鶴見線"},
                {color: "#80C241", name: "横浜線"},
                {color: "#009793", name: "相模線"},
                {color: "#A8A39D", name: "八高線・川越線"},
                {color: "#F68B1E", name: "東海道線・伊東線・宇都宮線・高崎線"},
                {color: "#007AC0", name: "横須賀・総武快速線"},
                {color: "#007AC0", name: "常磐線"},
                {color: "#00B9F1", name: "内房線"},
                {color: "#DB4028", name: "外房線"},
                {color: "#FFC20D", name: "総武本線"},
                {color: "#00B261", name: "成田線"},
                {color: "#F15A22", name: "東金線"},
                {color: "#C56E2E", name: "鹿島線"},
                {color: "#880022", name: "日光線"},
                {color: "#339966", name: "烏山線"}
            ]
        }),
        computed: {
            enableBoardLight(){
                const t = this.signBoard.type;
                return t.substr(0, 2) === "SE" || t[0] === "B";
            }
        },
        methods: {
            loadFont(lang){
                const self = this;
                const config = {
                    japanese: {
                        families: ["M PLUS 1p:n5,n8"],
                        urls: ["https://fonts.googleapis.com/css?family=M+PLUS+1p"]
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
                const df = defaultData();
                Object.keys(df).forEach(key => this[key] = df[key]);
            },
            share_url(){
                if(!this.$el.checkValidity()) return;
                //保存
                this.shareURL = location.protocol + "//" + location.host + location.pathname + "?desig1=" + LZString.compressToEncodedURIComponent(desig1.stringify(this));
            },
            copy(text){
                document.addEventListener("copy", e => {
                    e.preventDefault();
                    e.clipboardData.setData("text/plain", text);
                }, {once: true});
                document.execCommand("copy");
            },
            saveAsPNG, update
        }
    });

    //ウェブフォント
    WebFont.load({
        /*google: {
            families: ["Open+Sans:700&text=0123456789MS", "Lato:700&text=ABDEFGHIJLNOPQRTUVWXYZ", "Cabin:700&text=CK"]
        },*/
        custom: {
            families: ["Open Sans", "Lato", "Cabin"],
            urls: [
                "https://fonts.googleapis.com/css?family=Open+Sans:700&text=0123456789MS",
                "https://fonts.googleapis.com/css?family=Lato:700&text=ABDEFGHIJLNOPQRTUVWXYZ",
                "https://fonts.googleapis.com/css?family=Cabin:700&text=CK"
            ]
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
