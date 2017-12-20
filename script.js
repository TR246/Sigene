(() => {
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
            update(){}
        }
    });
})();