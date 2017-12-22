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
            }
        },
        floure: {
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        },
        led: {
            padding: {
                top: 90,
                left: 70,
                right: 70,
                bottom: 37
            }
        },
        nonLight: {
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        }
    };

    //描画
    const canvasUI = new Canvas("#canvasUI");
    const objects = [
        new Canvas.Object({
            type: "rect",
            fill: "#111",
            x: 0,
            y: 0,
            width: "100cw",
            height: 50
        })
    ];
    objects.forEach(obj => canvasUI.addObject(obj, 0));
    const update = function(){
        const {size: {width, height}, signType, signBoard, numbering, branchRight, branchLeft, sta} = this;

        const fp = frames[signBoard.type].padding;

        const fw = width + fp.left + fp.right;
        const fh = height + fp.top + fp.bottom;
        
        const {width: _cw, height: _ch} = contain(document.body.clientWidth, window.innerHeight * 0.5, fw, fh);
        const cw = Math.floor(_cw) * devicePixelRatio;
        const ch = Math.floor(_ch) * devicePixelRatio;

        canvasUI.width = cw;
        canvasUI.height = ch;

        canvasUI.backgroundColor = "#FFF";

        canvasUI.scale = cw / fw;
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
            update
        }
    });

    window.addEventListener("resize", () => update.call(vm));
})();