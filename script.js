(() => {
    //バインド
    const bindedSymbol = Symbol();
    const propBindedSymbol = Symbol();
    const watchers = {};
    const bindElement = (el, obj, key, onchange) => {
        if(el[bindedSymbol]){ return; }
        el[bindedSymbol] = true;
        switch(el.tagName.toLowerCase()){
            case "input":
                if(["text", "number"].includes(el.type)){
                    el.value = obj[key];
                    el.addEventListener("input", () => {
                        const value = el.value;
                        obj[key] = value;
                        if(onchange) onchange(key, value);
                        if(watchers[key]) watchers[key].forEach(fn => fn(value));
                    });
                }
                break;

            case "select":
                el.selectedIndex = obj[key];
                el.addEventListener("change", () => {
                    const value = el.selectedIndex;
                    obj[key] = value;
                    if(onchange) onchange(key, value);
                    if(watchers[key]) watchers[key].forEach(fn => fn(value));
                });
                break;
        }
    };
    const bindingData = {
        width: 2250,
        height: 600,
        signType: 0,
        signData: {
            boardType: 2,
            boardLighting: true,
            staNameKanji: "東京",
            staNameEnglish: "Tōkyō",
            staNameKana: "とうきょう",
            staNameChinese: "东京",
            staNameKorean: "도쿄"
        }
    };
    Array.from(document.getElementById("general").querySelectorAll("[data-bind]"))
        .forEach(el => bindElement(el, bindingData, el.getAttribute("data-bind")));
    Array.from(document.getElementById("generator").querySelectorAll("[data-bind]"))
        .forEach(el => bindElement(el, bindingData.signData, el.getAttribute("data-bind")));
})();