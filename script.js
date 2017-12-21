(() => {
    //Canvas
    const canvasArea = document.getElementById("canvasArea");

    const canvasUI = document.getElementById("canvasUI");
    const ctxUI = canvasUI.getContext("2d");

    const contain = (width1, height1, width2, height2) => {
        //r1, r2は数値が大きいほど横長
        const r1 = width1 / height1;
        const r2 = width2 / height2;
        return r1 > r2?
            {width: r2 * height1, height: height1} : //親のほうが横長 高さをあわせる
            {width: width1, height: width1 / r2}; //子のほうが横長 幅をあわせる
    };
    //描画
    const update = function(){
        const {size: {width, height}, signType, signBoard, numbering, branchRight, branchLeft, sta} = this;
        
        const {width: cWidth, height: cHeight} = contain(document.body.clientWidth - 40, window.innerHeight * 0.5 - 40, width, height);

        canvasUI.width = cWidth;
        canvasUI.height = cHeight;
        
        ctxUI.strokeStyle = "#000";
        ctxUI.lineWidth = 5;
        ctxUI.beginPath();
        ctxUI.moveTo(10, 10);
        ctxUI.lineTo(200, 200);
        ctxUI.stroke();
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