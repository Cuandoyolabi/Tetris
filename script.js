// Configuracion Inicial de la pagina.
let Pagina = {
    isSetup: false,
    body: document.getElementsByTagName('body')[0],
    cvs: document.createElement('canvas'),
    ctx: 0,
    unitSize: 0,
    AreaArr: [],

    // Calculando el tamaño de la unidad, estructura y posicion delc canvas.
    WindowChanged: function() {

        //Calculando la Unidad basandonos en la altitud y el ancho.
        let bodyW = document.documentElement.clientWidth,
            bodyH = document.documentElement.clientHeight,
            newUnitW = (bodyW - (bodyW % 80)) / 16,
            newUnitH = (bodyH - (bodyH % 100)) / 20,
            newUnitMin = Math.max(Math.min(newUnitW, newUnitH), 20);

            // Si calcUnitMin != unitSize, mejorar unitSize, recalcular
            // Todos los Objetos de area y mejorar la estructura del canvas.

            //Aqui se le da un nuevo valor minimo a unitSize.
            this.unitSize = newUnitMin;

            // Variables y bucles que definen el limite
            let rightLimit = 0,
            bottomLimit = 0;

            for (let i = 0; i < Page.AreaArr.length; i++){
                Page.AreaArr[i].calculateBounds();

                let newRightLimit = Page.AreaArr[i].left + Page.AreaArr[i].W,
                    newBottomLimit = Page.AreaArr[i].top + Page.AreaArr[i].H;

                rightLimit = Math.max(newRightLimit, rightLimit);
                bottomLimit = Math.max(newBottomLimit, bottomLimit);
            }

            this.cvs.width = rightLimit;
            this.cvs.height = bottomLimit;

            //La posicion izquirda usa Game.w porque esa centrada
            let topPos = (bodyH - bottomLimit) / 2,
                leftPos = (bodyW / 2) - (this.Game.W / 2),
                rightOffset = bodyW - (leftPos + rightLimit) - this.unitSize * 0.5;

            // Si la posicion predetermiada del canvas se extiende, ajustarla.
            if(rightOffset < 0){
                leftPos = Math.max(this.unitSize * 0.5, leftPos + rightOffset);
            }

            this.cvs.style.left = leftPos + 'px';
            this.cvs.style.top = topPos + 'px';
    },

    // Configuracion de la pagina.
    Initialize: function() {
        //Si la pagina no ah sido configurada, inicia la configuracion inicial.
        if(this.isSetup === false){
            document.body.appendChild(Page.cvs);

            this.body.style.overflow = 'hidden';
            this.body.style.backgroundColor = 'rgb(19,21,25);'
            this.cvs.style.position = 'absolute';
            this.ctx = this.cvs.getContext('2d');

            this.isSetup = true;
        }
        this.WindowChanged();

        //Ensucia todas ls areas de dibujo.
        for(let i = 0; i < Page.AreaArr.length; i++){
            Page.AreaArr[i].isDirty = true;
        }
    },

    //Redibujar canvas visualmente cuando la pagina este marcada como sucia.
    Update: function(){
        for(let i = 0; i < Page.AreaArr.length; i++){
            if(Page.AreaArr[i].isDirty){
                Page.AreaArr[i].Draw();
                Page.AreaArr[i].isDirty = false;
            }
        }
    }
};

//Definicion de objetos de Area. Y limites de unidades.
function DrawAreaObj(Left, Top, Width, Height, DrawFunction){

    //Limites de unidades.
    this.leftBase = Left;
    this.topBase = Top;
    this.widthBase = Width;
    this.heightBase = Height;

    //Limites en pixeles.
    this.left = 0;
    this.top = 0;
    this.W = 0;
    this.H = 0;

    //Bandera sucia.
    this.isDirty = false;

    //Recalculando limites y areas sucias cuando unitSize cambie.
    this.calculateBounds = function(){
        this.left = this.leftBase * Page.unitSize;
        this.top = this.topBase * Page.unitSize;
        this.W = this.widthBase * Page.unitSize;
        this.H = this.heightBase * Page.unitSize;
        this.isDirty = true;
    };

    //Dibujar la funcion tal como la pasa el destinatario.
    this.Draw = DrawFunction;

    //Empuja esta area adentro del Area arr.
    Page.AreaArr.push(this);
};


Page.Game = new DrawAreaObj(0, 0, 10, 20, functon() {
    
    //Dandole unos pixeles de separcion.
})