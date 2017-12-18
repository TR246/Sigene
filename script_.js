(() => {
    const vm = new Vue({
        el: ".form",
        created(){
            this.generatorData[this.signType].forms.forEach(form => {
                form.contents.forEach(content => {
                    this.signData[content.model] = content.value;
                })
            });
        },
        data: {
            size: {
                width: 2250,
                height: 600
            },
            signType: "jre-kanji",
            signData: {},
            generatorData: JSON.parse(document.getElementById("generatorData").textContent)
        }
    });
})();