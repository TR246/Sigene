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
            const lineY = height * 0.68; //線の中心Y位置
            const lineHeight = 120; //線の太さ
            const lineHeight_ceil = Math.ceil(lineHeight);
            const lineTop = lineY - lineHeight / 2; //線の上部Y位置
            const lineTop_floor = Math.floor(lineTop);
            const lineBottom = lineY + lineHeight / 2; //線の下部Y位置
            //右
            if(data.branchRight){
                //分岐する場合
            }else{
                //分岐しない場合
                /*maskCtx.beginPath();
                maskCtx.moveTo(hw_floor, lineTop);*/
                maskCtx.fillRect(hw_floor, lineTop, hw_ceil, lineHeight);
                colorCtx.fillStyle = "#006400";
                colorCtx.fillRect(hw, lineTop_floor, hw_ceil, lineHeight_ceil);
            }
            //左
            if(data.branchLeft){
                //分岐する場合
            }else{
                //分岐しない場合
                maskCtx.fillRect(0, lineTop, hw_ceil, lineHeight);
                colorCtx.fillStyle = "#006400";
                colorCtx.fillRect(0, lineTop_floor, hw_ceil, lineHeight_ceil);
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
        mounted: update,
        data: {
            macrons: ["Ā", "Ē", "Ī", "Ō", "Ū", "ā", "ē", "ī", "ō", "ū"],
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
                    bandColor: "#006400",
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
                    bandColor: "#006400",
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
                    bandColor: "#006400",
                    go: false,
                    numberings: []
                },
                {
                    name: {
                        kanji: "",
                        english: ""
                    },
                    bandColor: "#006400",
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
            }]
        },
        computed: {
            enableBoardLight(){
                return ["floure", "led"].includes(this.signBoard.type);
            }
        },
        methods: {
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