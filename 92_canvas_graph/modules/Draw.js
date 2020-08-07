class Draw {

    constructor( type, color, canvas, yTextPlace = 'left', canvas_pointer, second_type, header, date ) {
        // status if all available data for specific graph was already downloaded
        this.isAllDownloadedForOneGraph = false;
        // date identificator in DB object
        this.date = date;
        this.ctx = canvas.getContext('2d');
        this.ctx_pointer = canvas_pointer.getContext('2d');
        // array of data object
        this.dataOrig    = pdoResp;
        // what graph to draw
        this.type = type;
        this.second_type = second_type;
        // how many lines to draw
        this.dataReduced = pdoResp;

        this.header = header;

        this.yTextPlace = yTextPlace;
        this.color = color;
        this.graphSpaceLeft = 50;
        this.graphSpaceBtn = 50;

        this.clientWidth  = canvas.clientWidth;
        this.clientHeight = canvas.clientHeight;


        this.canvas_pointer = canvas_pointer;

        canvas_pointer.addEventListener('mousemove', ()      => this.getInfo() );
        canvas_pointer.addEventListener('mousedown', (event) => this.button.click(event) );

        this.xForInfo = this.clientWidth  - this.graphSpaceLeft;
        this.yForInfo = this.clientHeight - this.graphSpaceBtn;


        // also for refresh:
        this.refresh = () => {

            this.start = this.dataReduced[0][this.date];
            this.end   = this.dataReduced[ this.dataReduced.length - 1][this.date];
            
            this.limit = this.lastDayNumber() - this.firstDayNumber() ;
            this.graphArray = this.graphArr();
            if ( !this.second_type ) {
                this.max = Math.max( ...this.graphArray );
                this.min = Math.min( ...this.graphArray );
                this.ctx.clearRect(0 , 0, this.clientWidth, this.clientHeight ); 
                console.log(`min: ${this.min}, max: ${this.max}`);
            } else {
                // 2nd graph in one canvas
                this.graphArray_second = this.graphArrSecond();

                const max = Math.max(...this.graphArray, ...this.graphArray_second);
                const min = Math.min(...this.graphArray, ...this.graphArray_second);

                console.log(`min: ${this.min}, max: ${this.max}`);

                this.max = max;
                this.min = min;

                this.max_second = max;
                this.min_second = min;

                if (this.color === 'white') {
                   console.log(this.color);
                   this.ctx.clearRect(0 , 0, this.clientWidth, this.clientHeight ); 
                }
            }
        }

        this.refresh();



    }

    // static method - use method without instantiate

    // button method
    get button(){

        const btnWidth  = 30;
        const btnHeight = 25;
        // X position of button
        const btnX = {
            startPrev : 0,
            startNext : btnWidth + 2,
            endPrev   : this.clientWidth - 2 * btnWidth - 2,
            endNext   : this.clientWidth - btnWidth
        };
        // create button
        const dispBtn = (posX, char, opacity) => {
            // show background
            this.ctx.beginPath(); 
            this.ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`; 
            this.ctx.clearRect(posX , 0, btnWidth, btnHeight ); 
            this.ctx.fillRect(posX, 0, btnWidth , btnHeight ); 
            // show text
            this.ctx.font = '30px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.textBaseline = 'hanging';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(char, posX + btnWidth / 2, 0);
        }
        // show all buttons
        const show = () => {
            dispBtn( btnX.startPrev, '<', 0.5 );
            dispBtn( btnX.startNext, '>', 0.5 );
            dispBtn( btnX.endPrev,   '<', 0.5 );
            dispBtn( btnX.endNext,   '>', 0.5 );
        }
        // click on button detection
        const click = (event) => {
            const x = event.offsetX;
            const y = event.offsetY;
            if (y >= 0  && y <= btnHeight ) {
                // decrease month
                if ( x >= btnX.startPrev && x <= btnX.startPrev + btnWidth) { this.updateGraph('start', -1); dispBtn( btnX.startPrev, '<', 0.9 ); }
                if ( x >= btnX.startNext && x <= btnX.startNext + btnWidth) { this.updateGraph('start', +1); dispBtn( btnX.startNext, '>', 0.9 ); }
                // add month
                if ( x >= btnX.endPrev && x <= btnX.endPrev + btnWidth) { this.updateGraph('end', -1); dispBtn( btnX.endPrev,   '<', 0.9 ); }
                if ( x >= btnX.endNext && x <= btnX.endNext + btnWidth) { this.updateGraph('end', +1); dispBtn( btnX.endNext,   '>', 0.9 );}
            }
        }
        // handle mousemove event over button
        const hover = ( x, y ) => {
            // if mouseover is inside button
            if (y >= 0  && y <= btnHeight ) {
                this.canvas_pointer.classList.remove('pointerOnGrab');
                if ( x >= btnX.startPrev && x <= btnX.startPrev + btnWidth) {
                    dispBtn( btnX.startPrev, '<', 0.9 );
                    this.canvas_pointer.classList.add('pointerOnGrab'); 
                } else {
                    dispBtn( btnX.startPrev, '<', 0.5 );
                }
                if ( x >= btnX.startNext && x <= btnX.startNext + btnWidth) {
                    dispBtn( btnX.startNext, '>', 0.9 );
                    this.canvas_pointer.classList.add('pointerOnGrab'); 
                } else {
                    dispBtn( btnX.startNext, '>', 0.5 );
                }
                if ( x >= btnX.endPrev   && x <= btnX.endPrev   + btnWidth) {
                    dispBtn( btnX.endPrev,   '<', 0.9 );
                    this.canvas_pointer.classList.add('pointerOnGrab'); 
                } else {
                    dispBtn( btnX.endPrev,   '<', 0.5 );
                }
                if ( x >= btnX.endNext   && x <= btnX.endNext   + btnWidth) {
                    dispBtn( btnX.endNext,   '>', 0.9 );
                    this.canvas_pointer.classList.add('pointerOnGrab');   
                } else {
                    dispBtn( btnX.endNext,   '>', 0.5 );
                }
            } else {

                if (  !(    (x >= this.graphSpaceLeft && x <= this.clientWidth  - this.graphSpaceLeft)
                         && (y >= this.graphSpaceBtn  && y <= this.clientHeight - this.graphSpaceBtn ) ) ){
                    // remove onGrab pointer outside button & graph
                    this.canvas_pointer.classList.remove('pointerOnGrab');
                    // decrease opacity of button outside button & graph
                    dispBtn( btnX.startPrev, '<', 0.5 );
                    dispBtn( btnX.startNext, '>', 0.5 );
                    dispBtn( btnX.endPrev,   '<', 0.5 );
                    dispBtn( btnX.endNext,   '>', 0.5 );
                }
            }
        }
        // return button methods
        return {
            show  : show,
            click : click,
            hover : hover
        }
    }


    getTextDateFromNewDate(updDate){
        return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
    }


    dataReducer(startOrEnd, move) {
        const dateBeforeModification = new Date( this[startOrEnd] );
        // change start or end date by +1 year or -1 year
        const updatedDate  = new Date( dateBeforeModification.setFullYear ( dateBeforeModification.getFullYear() + move )  );
        // get new filtered data array
        const dataReducedForValidation = this.dataOrig.filter( (value) => {
            const oneDate = new Date( value[this.date] );
            if ( startOrEnd === 'start' ) return ( oneDate >= updatedDate ) && ( oneDate <= new Date(this.end)   );
            if ( startOrEnd === 'end'   ) return ( oneDate <= updatedDate ) && ( oneDate >= new Date(this.start) );
        });
        // check if new array is valid
        console.log(dataReducedForValidation.length);
        if (   dataReducedForValidation[0] === null
            || dataReducedForValidation[0] === undefined
            || dataReducedForValidation.length < 2
        ) return null; 
        return this.dataReduced = dataReducedForValidation;

    }
    

    async updateGraph(startOrEnd, move) {
        console.time('Start');
        // promis AJAX query
        if (isAllDownloaded === false) {
            try { 
                pdoResp = await loadPocasi('1999-01-01', '2099-01-01');
                //console.timeLog('Start');
                console.timeEnd('Start');
                isAllDownloaded = true;
            }
            catch (err) {
                console.log(err)
                return null;
            }
        }
        // 
        if ( this.isAllDownloadedForOneGraph === false) {
            this.dataOrig = pdoResp;
            this.isAllDownloadedForOneGraph = true;
        }
        // change start or end date for graph
        this.dataReducer(startOrEnd, move);
        // update variables needed for fresh graph
        console.log( `%c this.start: ${this.start}`, 'color: green; font-weight: bold;' );
        console.log( `%c this.end:   ${this.end  }`, 'color: red  ; font-weight: bold;' );
        this.refresh();
        console.log( `%c this.start: ${this.start}`, 'color: green; font-weight: bold;' );
        console.log( `%c this.end:   ${this.end  }`, 'color: red  ; font-weight: bold;' );
        // show fresh graph
        this.graph();
    }


    getInfo(x = event.offsetX, yPos = event.offsetY){

        // get coordinates inside canvas
        // const x = event.offsetX;
        // const y = event.offsetY;

        this.button.hover( x, yPos);

        // if mouseover is inside graph
        if (   (x >= this.graphSpaceLeft && x <= this.clientWidth  - this.graphSpaceLeft) &&
               (yPos >= this.graphSpaceBtn  && yPos <= this.clientHeight - this.graphSpaceBtn ) ){

            //this.yForInfo = y;
            this.xForInfo = x;
            this.yForInfo = yPos;

            // enable cursor
            this.canvas_pointer.classList.add('pointerOn');

            // clear whole canvas
            this.ctx_pointer.clearRect(0 , 0, this.clientWidth, this.clientHeight ); 

            // get date in format 2020-11-06 from event.clientX
            const valueX = (x - this.graphSpaceLeft) / ( (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit );
            const dayNumber = this.firstDayNumber() + valueX;
            const dayNumberInMs = dayNumber * ( 1000 * 60 * 60 * 24 );
            const shortDate = this.getTextDateFromNewDate( new Date(dayNumberInMs) );
            // search entry with datum
            const valueY = (this.dataReduced).find( value => value[this.date] == shortDate );
            const showInfo = () => {
                // calculate y for graph from 
                const y = this.graphSpaceBtn + (this.max - valueY[this.type]) / (this.max - this.min) * (this.clientHeight - 2 * this.graphSpaceBtn )

                // show line for x
                this.ctx_pointer.beginPath(); 
                this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                this.ctx_pointer.fillRect(x , this.graphSpaceBtn, 1 , this.clientHeight - 2 * this.graphSpaceBtn ); 

                // show background for X text
                this.ctx_pointer.beginPath(); 
                this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                this.ctx_pointer.fillRect(x - 40, this.graphSpaceBtn - 20, 80 , 20 ); 

                // show X text
                this.ctx_pointer.font = '12px Arial';
                this.ctx_pointer.fillStyle = 'white';
                this.ctx_pointer.textBaseline = 'middle';
                this.ctx_pointer.textAlign = 'center';
                this.ctx_pointer.fillText( ` ${ shortDate }`, x, this.graphSpaceBtn - 8 );


                const infoLeftY = ( type, yValue ) => {
                    // show line for y
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                    this.ctx_pointer.fillRect(this.graphSpaceLeft , yValue , x - this.graphSpaceLeft , 1 ); 

                    // show background for Y text
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                    this.ctx_pointer.fillRect(0, yValue - 10, this.graphSpaceLeft , 20 ); 

                    // show Y text
                    this.ctx_pointer.font = '12px Arial';
                    this.ctx_pointer.fillStyle = 'white';
                    this.ctx_pointer.textBaseline = 'middle';
                    this.ctx_pointer.textAlign = 'right';
                    this.ctx_pointer.fillText(` ${ valueY[type] }`, this.graphSpaceLeft, yValue );
                }

                const infoRightY = ( type, yValue ) => {

                    // show line for y second
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                    this.ctx_pointer.fillRect(x, yValue, this.clientWidth - this.graphSpaceLeft - x, 1 ); 

                    // show background for Y second text
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                    this.ctx_pointer.fillRect(this.clientWidth - this.graphSpaceLeft, yValue - 10, this.graphSpaceLeft , 20 ); 

                    // show Y second text
                    this.ctx_pointer.font = '12px Arial';
                    this.ctx_pointer.fillStyle = 'white';
                    this.ctx_pointer.textBaseline = 'middle';
                    this.ctx_pointer.textAlign = 'left';
                    this.ctx_pointer.fillText(` ${ valueY[type] }`, this.clientWidth - this.graphSpaceLeft, yValue );
                }
                // 2nd graph in canvas
                if ( !this.second_type ) {
                    if ( this.yTextPlace === 'left' ) {
                        infoLeftY( this.type, y );
                    } else {
                        infoRightY(this.type, y);
                    }
                } else {
                    const ySecond = this.graphSpaceBtn + (this.max_second - valueY[this.second_type]) / (this.max_second - this.min_second) * (this.clientHeight - 2 * this.graphSpaceBtn )
                    if ( this.yTextPlace === 'right' ) {
                        infoRightY(this.type, y);
                        infoLeftY( this.second_type, ySecond );
                    } else {
                        infoLeftY( this.type, y );
                        infoRightY(this.second_type, ySecond);
                    }
                }
            }

            if (valueY) {
                showInfo();
            }

        } else {
            // disable cursor
            this.canvas_pointer.classList.remove('pointerOn');
        }
    }

    setClientWidthHeight(){
        this.clientWidth  = canvas.clientWidth;
        this.clientHeight = canvas.clientHeight;
    }

    resizeCanvas() {
        this.setClientWidthHeight();
        console.log(`resized: w:${canvas.width} x h:${canvas.height} `);
        this.graph(this.xForInfo, this.yForInfo);
    }
    
    graphArr() {
        const myArray = [];
        this.dataReduced.forEach( value => myArray.push( value[this.type] ) );
        return myArray;
    }

    graphArrSecond() {
        const myArray = [];
        this.dataReduced.forEach( value => myArray.push( value[this.second_type] ) );
        return myArray;
    }

    axesXY( color = 'grey' ) {

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

            this.textXY(x);
        }
        this.ctx.stroke();

        // show red buttons
        this.button.show();

        // show graph header
        this.textHeader();

        // show year lines
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
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = 'top';

        if ( this.yTextPlace === 'right' ) {
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.header, this.clientWidth / 2, 0);
        } else {
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.header, this.clientWidth / 2, 20);
        }
    }

    // values (dates) on axes X
    textXY(x) {
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
        //this.yTextPlace === 'right' ? this.ctx.textAlign = 'left' : this.ctx.textAlign = 'right';
        if ( this.yTextPlace === 'right' ) {
            this.ctx.textAlign = 'left';
            this.ctx.fillText(
                ` ${ ( this.min + (this.max - this.min) * (x) / 10 ).toFixed(1) }`,
                this.clientWidth - this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn - (this.clientHeight - 2 * this.graphSpaceBtn) * x / 10
            );
        } else {
            this.ctx.textAlign = 'right'
            this.ctx.fillText(
                `${ ( this.min + (this.max - this.min) * (x) / 10 ).toFixed(1) } `,
                this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn - (this.clientHeight - 2 * this.graphSpaceBtn) * x / 10
            );
        }

    }

    graph() {

        // show axess
        this.axesXY();
        const line = ( oneEntry ) => {
            this.ctx.lineTo(
                // X
                this.graphSpaceLeft + this.xValueFromDate(oneEntry[this.date]) * (this.clientWidth - 2 * this.graphSpaceLeft)/this.limit,
                // Y
                this.graphSpaceBtn + (this.max - oneEntry[this.type]) / (this.max - this.min) * (this.clientHeight - 2 * this.graphSpaceBtn )
                )
        }
        this.ctx.beginPath();
        //this.ctx.moveTo(0,0)
        this.ctx.setLineDash([0]);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.dataReduced.forEach( ( oneEntry, index ) => line( oneEntry, index )  );
        //this.ctx.closePath();
        this.ctx.stroke();

        this.getInfo(this.xForInfo, this.yForInfo);
    }
}
