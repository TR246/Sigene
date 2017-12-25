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
            light(){}
        },
        floure: {
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            draw(ctx, width, height, scale){},
            light(ctx, width, height, scale){}
        },
        led: {
            padding: {
                top: 90,
                left: 70,
                right: 70,
                bottom: 37
            },
            draw(ctx, width, height, scale){
                //全体
                ctx.fillStyle = "#333";
                ctx.fillRect(0, 0, width, height);

                //周囲
                ctx.beginPath();
                ctx.moveTo(6, height);
                ctx.lineTo(6, 6);
                ctx.lineTo(width - 6, 6);
                ctx.lineTo(width - 6, height);
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
                ctx.moveTo(width - 10, 6);
                ctx.lineTo(width - 10, 90);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(6, 90);
                ctx.lineTo(width - 6, 90);
                ctx.stroke();
                
                //下部
                const bGrad = ctx.createLinearGradient(0, height, 0, height - 8);
                bGrad.addColorStop(0, "rgba(0, 0, 0, 0.5)");
                bGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = bGrad;
                ctx.fillRect(7, height - 8, width - 14, 8);

                ctx.shadowColor = "#000";
                ctx.shadowBlur = 5;
                ctx.fillStyle = "#333";
                ctx.fillRect(10, height - 37, width - 20, 13);

                //本体
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#BBB";
                ctx.fillRect(70, 90, width - 140, height - 127);
            },
            light(ctx, width, height, scale){
                //光1
                ctx.shadowColor = "#F8FAFF";
                ctx.shadowBlur = 40 * scale;
                ctx.shadowOffsetY = height * scale;
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(100, 120 - height, width - 200, height - 187);
                //光2
                ctx.shadowBlur = 100 * scale;
                ctx.beginPath();
                ctx.moveTo(170, 190 - height);
                ctx.lineTo(width - 170, 190 - height);
                ctx.lineTo(width - 270, -237);
                ctx.lineTo(270, -237);
                ctx.closePath();
                ctx.fill();
            }
        },
        nonLight: {
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            draw(ctx, width, height, scale){},
            light(ctx, width, height, scale){}
        }
    };

    const drawFns = {
        "jre-kanji"(ctx, data){}
    };

    //描画
    const canvas1 = document.getElementById("canvas1");
    const ctx1 = canvas1.getContext("2d");

    const update = function(){
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

        const scale = cw / fw;
        ctx1.scale(scale, scale);
        frame.draw(ctx1, fw, fh, scale);
        if(signBoard.light) frame.light(ctx1, fw, fh, scale);

        ctx1.translate(fp.left, fp.top);
        drawFns[this.signType](ctx1, this);
    };

    //保存
    const saveAsPNG = function(){
        const canvas2 = document.createElement("canvas");
        const ctx2 = canvas2.getContext("2d");

        const frame = frames[this.signBoard.type];
        const fp = frame.padding;

        const width = this.size.width + fp.left + fp.right;
        const height = this.size.height + fp.top + fp.bottom;
        canvas2.width = width;
        canvas2.height = height;

        frame.draw(ctx2, width, height, 1);
        if(this.signBoard.light) frame.light(ctx2, width, height, 1);

        ctx2.translate(fp.left, fp.top);
        drawFns[this.signType](ctx2, this);

        const a = document.createElement("a");
        a.download = "駅名標_" + this.sta.name.kanji + ".png";
        a.href = canvas2.toDataURL();
        a.dispatchEvent(new MouseEvent("click"));
    };

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
            branchRight: false,
            branchLeft: false,
            sta: {
                name: {
                    kanji: "市川",
                    english: "Ichikawa",
                    kana: "いちかわ",
                    chinese: "市川",
                    korean: "이치카와"
                },
                numbering: "JB 27",
                enableTlc: false,
                tlc: ""
            }
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
            formatUppercase(key){
                replaceProperty(
                    this, key,
                    v => v.replace(/[Ａ-Ｚａ-ｚ０-９]/g,
                        c => String.fromCharCode(c.charCodeAt(0) - 65248))
                        .toUpperCase());
            },
            save(){},
            saveAsPNG, update
        }
    });

    window.addEventListener("resize", () => update.call(vm));
})();