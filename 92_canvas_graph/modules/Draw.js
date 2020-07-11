class Draw {

    constructor( type, color, canvas, yTextPlace = 'left') {
        // what graph to draw
        this.type = type;
        // array of data object
        this.data = pdoResp;
        // how many lines to draw
        this.start = this.data[0].datum;
        this.end   = this.data[ this.data.length - 1].datum;
        this.limit = this.lastDayNumber() - this.firstDayNumber() ;

        this.graphArray = this.graphArr();

        this.max = Math.max( ...this.graphArray );
        this.min = Math.min( ...this.graphArray );
        this.yTextPlace = yTextPlace;
        this.color = color;
        this.graphSpaceLeft = 50;
        this.graphSpaceBtn = 50;

        this.clientWidth  = canvas.clientWidth;
        this.clientHeight = canvas.clientHeight;

        this.ctx = canvas.getContext('2d');
        this.ctx_pointer = canvas_pointer.getContext('2d');

        this.lastPointerX = 0;
        this.lastPointerY = 0;

        canvas_pointer.addEventListener('mousemove', () => this.getInfo() );
    }

    // static method - use method without instantiate

    getInfo(){

        const x = event.clientX;

        if (x >= this.graphSpaceLeft && x <= this.clientWidth - this.graphSpaceLeft ) {
            // clear pointer X
            this.ctx_pointer.clearRect(this.lastPointerX - 1 , this.graphSpaceBtn, 10 , this.clientHeight - 1 * this.graphSpaceBtn ); 
            // clear pointer Y
            this.ctx_pointer.clearRect(this.graphSpaceLeft , this.lastPointerY - 10 , this.lastPointerX - this.graphSpaceLeft , 20 ); 

            const valueX = (x - this.graphSpaceLeft) / ( (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit );
            const dayNumber = valueX + this.firstDayNumber();
            const dayNumberMs = dayNumber * ( 1000 * 60 * 60 *24 );
            const myDate = new Date(dayNumberMs);
    
            const shortDate = `${myDate.getFullYear()}-${ ('0' + (myDate.getMonth() + 1)).slice(-2) }-${ ('0' + myDate.getDate()).slice(-2) }`;
    
            // xValueFromDate( date ) {
            //     const myDate = new Date( date );
            //     const dayNumber =  myDate.getTime() / ( 1000 * 60 * 60 *24 ) ;
                
            //     valueX + this.firstDayNumber() = dayNumber;
    
            const dateCheck = (value, id) => {
                return value.datum == shortDate;
            }
            const valueY = (this.data).find( (value, id) => dateCheck(value, id) );
    
            const y = this.graphSpaceBtn + (this.max - valueY.hladina) / (this.max - this.min) * (this.clientHeight - 2 * this.graphSpaceBtn )

            this.ctx_pointer.beginPath(); 
            this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
            this.ctx_pointer.fillRect(this.graphSpaceLeft , y , x - this.graphSpaceLeft , 1 ); 

            console.log(`${valueY.hladina}`);
    
            this.ctx_pointer.beginPath(); 
            this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
            this.ctx_pointer.fillRect(x , this.graphSpaceBtn, 1 , this.clientHeight - 2 * this.graphSpaceBtn ); 
    
            this.lastPointerX = x;
            this.lastPointerY = y;
        }


    }

    setClientWidthHeight(){
        this.clientWidth  = canvas.clientWidth;
        this.clientHeight = canvas.clientHeight;
    }

    resizeCanvas() {
        this.setClientWidthHeight();
        console.log(`resized: w:${canvas.width} x h:${canvas.height} `);
        this.graph(canvas.width, canvas.height);
    }
    
    graphArr() {
        const myArray = [];
        this.data.forEach( value => myArray.push( value[this.type] ) );
        return myArray;
    }

    axesX( color = 'grey' ) {
        const size = this.graphArray.length;
        const sizeReduced = this.graphSpaceLeft + size * (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit;
        console.log(`axesX() - size: ${size} / sizeReduced: ${Math.round(sizeReduced)}`);

        //line arround graph
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo( this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn );
        this.ctx.lineTo( this.clientWidth - this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn );
        this.ctx.lineTo( this.clientWidth - this.graphSpaceLeft, this.graphSpaceBtn );
        this.ctx.lineTo( this.graphSpaceLeft, this.graphSpaceBtn );
        this.ctx.closePath();
        this.ctx.stroke();

        // inner axesX & axesY
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([1, 2]);
        for(let x = 10; x >= 0; x-- ) {
            // axes X 
            this.ctx.moveTo( this.graphSpaceLeft                   , this.clientHeight - this.graphSpaceBtn - (this.clientHeight - 2 * this.graphSpaceBtn) * x / 10 );
            this.ctx.lineTo( this.clientWidth - this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn - (this.clientHeight - 2 * this.graphSpaceBtn) * x / 10 );
            // axes Y
            this.ctx.moveTo( this.clientWidth - this.graphSpaceLeft - (this.clientWidth - 2 * this.graphSpaceLeft) * x / 10, this.graphSpaceBtn );
            this.ctx.lineTo( this.clientWidth - this.graphSpaceLeft - (this.clientWidth - 2 * this.graphSpaceLeft) * x / 10, this.clientHeight - this.graphSpaceBtn);

            this.textX(x);
        }
        this.ctx.stroke();

        this.textHeader();

        this.yearLine();

    }

    firstDayNumber() {
        const firstDate = new Date( this.start );
        return firstDate.getTime() / ( 1000 * 60 * 60 *24 ) ;
    }

    lastDayNumber() {
        const lastDate = new Date( this.end );
        return lastDate.getTime() / ( 1000 * 60 * 60 *24 ) ;
    }

    yearLine() {
        let x;
        const firstYear = new Date( this.start ).getFullYear();
        const lastYear  = new Date( this.end   ).getFullYear();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([1, 0]);
        for (let year = firstYear + 1; year <= lastYear; year++) {
            x = `${year}-01-01`;
            console.log(x);
            this.ctx.moveTo( this.graphSpaceLeft + this.xValueFromDate(x) * (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit, this.graphSpaceBtn );
            this.ctx.lineTo( this.graphSpaceLeft + this.xValueFromDate(x) * (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit, this.clientHeight - this.graphSpaceBtn );
            // text for axes Y
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(
                `${year}`,
                this.graphSpaceLeft + this.xValueFromDate(x) * (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit, this.graphSpaceBtn
            );
        }
        this.ctx.stroke();

    }

    xValueFromDate( date ) {
        const myDate = new Date( date );
        const dayNumber =  myDate.getTime() / ( 1000 * 60 * 60 *24 ) ;
        return dayNumber - this.firstDayNumber();
    }

    textHeader() {
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = 'hanging';

        if ( this.yTextPlace === 'right' ) {
            this.ctx.textAlign = 'right';
            this.ctx.fillText(this.type, this.clientWidth - this.graphSpaceLeft, 0);
        } else {
            this.ctx.textAlign = 'left';
            this.ctx.fillText(this.type, this.graphSpaceLeft, 0);
        }
    }

    // values (dates) on axes X
    textX(x) {
        const miliSec = ( 1000 * 60 * 60 *24 ) * ( this.firstDayNumber() + this.limit * (10 - x) / 10 );
        const dateX = new Date(miliSec);
        const year = '' + dateX.getFullYear();
        const month = 1 + dateX.getMonth();
        const day = dateX.getDate();
        
        // text for axes X
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.save();
        this.ctx.translate(
            - this.graphSpaceLeft / 1.25 + this.clientWidth  - (this.clientWidth - 2 * this.graphSpaceLeft) * x / 10,
            - this.graphSpaceBtn / 1.25 + this.clientHeight
        );
        this.ctx.rotate( - Math.PI / 4);
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${day}.${month}.`, 0, 0);
        this.ctx.restore();
        
        // text for axes Y
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = 'middle';
        this.yTextPlace === 'right' ? this.ctx.textAlign = 'left' : this.ctx.textAlign = 'right';
        if ( this.yTextPlace === 'right' ) {
            this.ctx.fillText(
                ` ${ ( this.min + (this.max - this.min) * (x) / 10 ).toFixed(1) }`,
                this.clientWidth - this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn - (this.clientHeight - 2 * this.graphSpaceBtn) * x / 10
            );
        } else {
            this.ctx.fillText(
                `${ ( this.min + (this.max - this.min) * (x) / 10 ).toFixed(1) } `,
                this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn - (this.clientHeight - 2 * this.graphSpaceBtn) * x / 10
            );
        }

    }

    graph() {

        this.axesX();

        const line = ( oneEntry ) => {
            // hladina = new Draw('hladina', 'white', period);
            this.ctx.lineTo(
                // X
                this.graphSpaceLeft + this.xValueFromDate(oneEntry.datum) * (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit,
                // Y
                this.graphSpaceBtn + (this.max - oneEntry[this.type]) / (this.max - this.min) * (this.clientHeight - 2 * this.graphSpaceBtn )
                )
        }
         this.ctx.beginPath();
         //this.ctx.moveTo(0,0)
         this.ctx.setLineDash([0]);
         this.ctx.strokeStyle = this.color;
         this.ctx.lineWidth = 1;
         this.data.forEach( ( oneEntry, index ) => line( oneEntry, index )  );
        //this.ctx.closePath();
        this.ctx.stroke();

    }

}
