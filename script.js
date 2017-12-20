(() => {
    const getByDotKey = (obj, key) => key.split(".").reduce((obj, key) => obj[key.trim()], obj);
    const setByDotKey = (obj, key, value) => {
        const keys = key.split(".");
        const last = keys.pop();
        const sObj = getByDotKey(obj, keys.join("."));
        sObj[last] = value;
    };

    const vm = new Vue({
        el: ".form",
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
                setByDotKey(this, key, getByDotKey(this, key)
                    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 65248))
                    .toUpperCase());
            },
            update(){
                console.log("update");
            }
        }
    });
})();