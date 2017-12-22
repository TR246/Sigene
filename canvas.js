const Canvas = (() => {
    //シンボル
    const S = {
        objId: Symbol("objId"),
        objType: Symbol("objType"),
        methodArgs: Symbol("methodArgs"),
        backgroundColor: Symbol("backgroundColor"),
        layers: Symbol("layers"),
        scale: Symbol("scale")
    };

    const objIds = [];

    //canvasに描くオブジェクト
    const reqArgs = {
        rect: ["x", "y", "width", "height"]
    };
    const listeners = {};
    class CanvasObject {
        constructor(options){
            if(options === undefined) throw new Error("Canvas Object コンストラクターには引数が必要です");
            const {type, id} = options;

            this.id = id;
            this[S.objId] = id;
            objIds.push(id);

            this.type = type;
            this[S.objType] = type;

            listeners[id] = listeners[id] || [];

            this[S.methodArgs] = [];
            const self = this;
            reqArgs[type].forEach((arg, i) => {
                if(!(arg in options)) throw new Error(`${type} には ${arg} が必要です`);
                self[S.methodArgs].push(options[arg]);
                Object.defineProperty(self, arg, {
                    get(){ return self[S.methodArgs][i] },
                    set(val){
                        self[S.methodArgs][i] = val;
                        listeners[id].forEach(f => f());
                    }
                });
            });
            if("fill" in options) this.fill = options.fill;
            if("stroke" in options) this.stroke = options.stroke;
            this.strokeThickness = options.strokeThickness || 1;
        }

        get type(){ return this[S.objType]; }
        set type(val){
            if(this.type) throw new Error("'type' プロパティは変更できません");
        }

        get id(){ return this[S.objId]; }
        set id(id){
            objIds.splice(objIds.indexOf(this[S.objId]), 1, id);
            this[S.objId] = id;
        }
    }

    const checkCanvasElem = arg => {
        if(arg instanceof HTMLCanvasElement){
            return arg;
        }else if(typeof arg === "string"){
            arg = document.querySelector(arg);
        }else{
            throw new TypeError("Canvas コンストラクターの引数は HTMLCanvasElement または セレクタ文字列 でなければなりません");
        }
        return checkCanvasElem(arg);
    }
    class Canvas {
        constructor(canvas){
            canvas = this.element = checkCanvasElem(canvas);
            this.context = canvas.getContext("2d");
            this.width = canvas.width;
            this.height = canvas.height;
            this.backgroundColor = "rgba(0, 0, 0, 0)";
            this[S.layers] = [[]];
            this.scale = 1;
            this[S.scale] = 1;
        }

        get width(){ return this.element.width; }
        set width(val){ this.element.width = val; }

        get height(){ return this.element.height; }
        set height(val){ this.element.height = val; }

        get imgWidth(){ return this.width / this.scale; }
        set imgWidth(val){
            this.scale = this.width / val;
        }

        get imgHeight(){ return this.height / this.scale; }
        set imgHeight(val){
            this.scale = this.height / val;
        }

        get backgroundColor(){ return this.element[S.backgroundColor]; }
        set backgroundColor(color){
            this.element[S.backgroundColor] = color;
            this.clear();
        }

        get scale(){ return this[S.scale]; }
        set scale(val){
            this[S.scale] = val;
            this.draw();
        }

        addObject(object, layerIdx){
            if(!(object instanceof CanvasObject)){ object = new CanvasObject(object); }
            const objects = this[S.layers];
            if(!objects[layerIdx]){ objects[layerIdx] = []; }
            listeners[object.id].push(() => this.draw());
            objects[layerIdx].push(object);
        }

        clear(){
            const ctx = this.context;
            ctx.save();
            ctx.clearRect(0, 0, this.element.width, this.element.height);
            ctx.beginPath();
            ctx.fillStyle = this.element[S.backgroundColor];
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }

        draw(){
            this.clear();
            const ctx = this.context;
            this[S.layers].forEach(layer => {
                layer.forEach(object => {
                    ctx.save();
                    switch(object.type.toLowerCase()){
                        case "rect":
                            ctx.rect(...object[S.methodArgs].map(value => {
                                if(isFinite(value)) return value * this.scale;
                                else{
                                    const arr = /(\d+)(\D+)/.exec(value);
                                    if(arr === null) throw new Error("無効な値です");

                                    return (arr[1] - 0) * {
                                        "": 1,
                                        "cw": this.imgWidth / 100,
                                        "ch": this.imgHeight / 100
                                    }[arr[2]] * this.scale;
                                }
                            }));
                            break;
                    }
                    if("fill" in object){
                        ctx.fillStyle = object.fill;
                        ctx.fill();
                    }
                    if("stroke" in object){
                        ctx.strokeStyle = object.stroke;
                        ctx.lineWidth = object.strokeThickness * this.scale;
                        ctx.stroke();
                    }
                    ctx.restore();
                });
            });
        }
    }

    Canvas.Object = CanvasObject;

    return Canvas;
})();