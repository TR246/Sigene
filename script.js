(() => {
    //バインド
    const bindElement = (el, obj, key, onchange) => {
        switch(el.tagName.toLowerCase()){
            case "input":
                if(["text", "number"].includes(el.type)){
                    el.value = bindingData[key];
                    el.addEventListener("input", () => {
                        const value = el.value;
                        bindingData[key] = value;
                        onchange(key, value);
                    });
                }
                break;

            case "select":
                el.selectedIndex = bindingData[key];
                el.addEventListener("change", () => {
                    const value = el.selectedIndex;
                    bindingData[key] = value;
                    onchange(key, value);
                });
                break;
        }
    };
    const bindingData = {
        width: 2250,
        height: 600,
        signType: 0
    };
    Array.from(document.querySelectorAll("[data-bind]"))
        .forEach(el => bindElement(el, bindingData, el.getAttribute("data-bind"), (key, value) => {
            document.getElementById("test").textContent = JSON.stringify(bindingData) + "\n変更されたキー: " + key + ", 変更された値: " + value;
        }));

    //generatordataから初期化
    const generatorData = JSON.parse(document.getElementById("generatorData").textContent);
})();