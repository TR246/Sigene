(() => {
    //Canvas
    const contain = (width1, height1, width2, height2) => {
        //r1, r2は数値が大きいほど横長
        const r1 = width1 / height1;
        const r2 = width2 / height2;
        return r1 > r2?
            {width: r2 * height1, height: height1} : //親のほうが横長 高さをあわせる
            {width: width1, height: width1 / r2}; //子のほうが横長 幅をあわせる
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
                ctx.strokeStyle = "#1A1A1A";
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
                ctx.fillStyle = data.signBoard.light? "#F8FAFF" : "#CCC";
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
                colorCtx.fillStyle = "#1A1A1A";
                const textWidth = Math.min(maxWidth || Infinity, maskCtx.measureText(text).width);
                colorCtx.fillRect((align === "left"? x : x - textWidth / 2) - 10, y - size - 10, textWidth + 20, size + 20);
                return textWidth;
            };

            //漢字
            const kanjiWidth = drawText({
                x: hw,
                y: lineTop - 140,
                text: data.sta.name.kanji.split("").join(["　", " "][data.sta.name.kanji.length - 2] || ""),
                weight: "700",
                size: 170,
                font: "'Mplus 1p', sans-serif"
            });
            //ひらがな
            drawText({
                x: hw,
                y: lineTop - 30,
                text: data.sta.name.kana,
                weight: "bold",
                size: 60,
                font: "'Mplus 1p', sans-serif"
            });
            //英語
            drawText({
                x: hw,
                y: lineBottom + 100,
                text: data.sta.name.english,
                weight: "bold",
                size: 80,
                font: "'Helvetica', 'Arial', sans-serif"
            });
            if(data.numbering){
                //4ヶ国語表記
                drawText({
                    x: hw + kanjiWidth / 2 + 80,
                    y: lineTop - 220,
                    text: data.sta.name.chinese,
                    size: 50,
                    font: "'Noto Sans SC', sans-serif",
                    align: "left"
                });
                drawText({
                    x: hw + kanjiWidth / 2 + 80,
                    y: lineTop - 150,
                    text: data.sta.name.korean,
                    size: 50,
                    font: "'Noto Sans KR', sans-serif",
                    align: "left"
                });

                //ナンバリング
            }
        }
    };

    //描画
    const canvas1 = document.getElementById("canvas1");
    const ctx1 = canvas1.getContext("2d");

    const update = function(){
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
            branchRight: true,
            branchLeft: false,
            sta: {
                name: {
                    kanji: "大宮",
                    english: "Ōmiya",
                    kana: "おおみや",
                    chinese: "大宫",
                    korean: "오미야"
                },
                enableTlc: true,
                tlc: "OMY",
                numberings: [{
                    text: "JU 07",
                    color: "#F68B1E"
                }, {
                    text: "JS 24",
                    color: "#C9242F"
                }]
            },
            rightStations: [
                {
                    name: {
                        kanji: "さいたま新都心",
                        english: "Saitama-Shintoshin"
                    },
                    lineColor: "#006400",
                    go: true,
                    numberings: [{
                        text: "JU 06",
                        color: "#F68B1E"
                    }]
                },
                {
                    name: {
                        kanji: "浦和",
                        english: "Urawa"
                    },
                    lineColor: "#006400",
                    go: true,
                    numberings: [{
                        text: "JS 23",
                        color: "#C9242F"
                    }]
                }
            ],
            leftStations: [
                {
                    name: {
                        kanji: "土呂",
                        english: "Toro"
                    },
                    lineColor: "#006400",
                    go: false,
                    numberings: []
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
            routeColors: ["#F68B1E", "#007AC0"]
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
                        families: ["Mplus 1p:n7"],
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
            save(){},
            saveAsPNG, update
        }
    });

    let eventTimer = 0;
    window.addEventListener("resize", () => {
        clearTimeout(eventTimer);
        eventTimer = setTimeout(() => update.call(vm), 300);
    });
})();