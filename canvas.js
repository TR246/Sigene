const Canvas = (() => {
    //シンボル
    const S = {
        objId: Symbol("objId"),
        objType: Symbol("objType"),
        backgroundColor: Symbol("backgroundColor"),
        objects: Symbol("objects"),
        scale: Symbol("scale")
    };

    const objIds = [];

    //canvasに描くオブジェクト
    class CanvasObject {
        constructor(options){
            if(options === undefined){ throw new Error("Canvas Object コンストラクターには引数が必要です。"); }
            const {type, id} = options;
            this.id = id;
            this[S.objId] = id;
            objIds.push(id);
            this.type = type;
            this[S.objType] = type;
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
            this[S.objects] = [[]];
            this.scale = 1;
            this[S.scale] = 1;
        }

        get width(){ return this.element.width; }
        set width(val){ this.element.width = val; }

        get height(){ return this.element.height; }
        set height(val){ this.element.height = val; }

        get backgroundColor(){ return this.element[S.backgroundColor]; }
        set backgroundColor(color){
            this.clear();
            this.element[S.backgroundColor] = color;
        }

        get scale(){ return this[S.scale]; }
        set scale(val){
            this[S.scale] = val;
            this.draw();
        }

        addObject(object, layerIdx){
            if(!(object instanceof CanvasObject)){ object = new CanvasObject(object); }
            const objects = this[S.objects];
            if(!objects[layerIdx]){ objects[layerIdx] = []; }
            objects[layerIdx].push(object);
        }

        clear(){
            const ctx = this.context;
            ctx.save();
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = this.element[S.backgroundColor];
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }

        draw(){
            this.clear();
            const ctx = this.context;
            ctx.save();
            console.log(this);
            ctx.restore();
        }
    }

    Canvas.Object = CanvasObject;

    return Canvas;
})();