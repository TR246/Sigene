const Canvas = (() => {
    //シンボル
    const S = {
        backgroundColor: Symbol(),
        objects: Symbol()
    };

    //canvasに描くオブジェクト
    class Obj {
        constructor(options){
            if(options === undefined){ throw new Error(""); }
            const {type} = options;
        }
    }

    const checkCanvasElem = arg => {
        if(arg instanceof HTMLCanvasElement){
            return arg;
        }else if(typeof arg === "string"){
            arg = document.querySelector(arg);
        }else{
            throw new TypeError("The argument must be an HTMLCanvasElement or a selector.");
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
            this[S.objects] = [];
        }

        get width(){ return this.element.width; }
        set width(val){ this.element.width = val; }

        get height(){ return this.element.height; }
        set height(val){ this.element.height = val; }

        get backgroundColor(){ return this.element[S.backgroundColor]; }
        set backgroundColor(color){
            this.clear();
            const ctx = this.context;
            ctx.save();
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
            this.element[S.backgroundColor] = color;
        }

        clear(){
            this.context.clearRect(0, 0, this.width, this.height);
        }

        addObject(object){
            if(!(object instanceof Obj)){ object = new Obj(object); }
        }
    }

    Canvas.Object = Obj;

    return Canvas;
})();