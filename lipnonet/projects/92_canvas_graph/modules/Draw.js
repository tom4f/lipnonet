class Draw {

    constructor( type, color, canvas, yTextPlace = 'left', canvas_pointer, second_type, header, date, sameY ) {
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

        // initial info position
        this.xForInfo = this.clientWidth  - this.graphSpaceLeft;
        this.yForInfo = this.clientHeight - this.graphSpaceBtn;

        // also for refresh:
        this.refresh = () => {

            this.start = this.dataReduced[0][this.date];
            this.end   = this.dataReduced[ this.dataReduced.length - 1][this.date];
            this.xLimit = this.lastDayNumber() - this.firstDayNumber();

            const graphArray = ( operation, type, second_type ) => {
                const myArray = [];
                this.dataReduced.forEach( value => {
                    myArray.push( value[type] );
                    if ( !second_type ) return null;
                    myArray.push( value[second_type] );
                 } );
                return Math[operation](...myArray);
            }

            if (sameY) {
                // for multiple graph - same Y
                this.maxSecond = this.max = graphArray('max', this.type, this.second_type);
                this.minSecond = this.min = graphArray('min', this.type, this.second_type);
                this.yLimitSecond = this.yLimit = this.max - this.min;

            } else {
                // for multiple graph - different Y
                this.max = graphArray('max', this.type);
                this.min = graphArray('min', this.type);
                this.yLimit = this.max - this.min;

                this.maxSecond = graphArray('max', this.second_type);
                this.minSecond = graphArray('min', this.second_type);
                this.yLimitSecond = this.maxSecond - this.minSecond;
            }

            // WA: do not clear canvas before second graph (second color)
            if ( this.color != 'white' ) return null;
            
            this.ctx.clearRect(0 , 0, this.clientWidth, this.clientHeight ); 
        }

        this.refresh();
    }

    // static method - use method without instantiate

    // like const???
    get MILISECONDS_FOR_ONE_DAY() { return 1000 * 60 * 60 * 24 };

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


        const isXinButton = (x) => {
            return {
                startPrev : x >= btnX.startPrev && x <= btnX.startPrev + btnWidth,
                startNext : x >= btnX.startNext && x <= btnX.startNext + btnWidth,
                endPrev   : x >= btnX.endPrev   && x <= btnX.endPrev   + btnWidth,
                endNext   : x >= btnX.endNext   && x <= btnX.endNext   + btnWidth
            }
        }

        // click on button detection
        const click = (event) => {
            const x = event.offsetX;
            const y = event.offsetY;
            if (y >= 0  && y <= btnHeight ) {
                const { startPrev, startNext, endPrev, endNext } = isXinButton(x);
                // decrease month
                if (startPrev) { this.updateGraph('start', -1); dispBtn( btnX.startPrev, '<', 0.9 ); }
                if (startNext) { this.updateGraph('start', +1); dispBtn( btnX.startNext, '>', 0.9 ); }
                // add month
                if (endPrev)   { this.updateGraph('end', -1); dispBtn( btnX.endPrev,   '<', 0.9 ); }
                if (endNext)   { this.updateGraph('end', +1); dispBtn( btnX.endNext,   '>', 0.9 );}
            }
        }
        // handle mousemove event over button
        const hover = ( x, y ) => {
            // if mouseover is inside button
            if (y >= 0  && y <= btnHeight ) {

                const { startPrev, startNext, endPrev, endNext } = isXinButton(x);

                startPrev || startNext || endPrev || endNext ? this.canvas_pointer.classList.add('pointerOnGrab')
                                                             : this.canvas_pointer.classList.remove('pointerOnGrab');
                startPrev ? dispBtn( btnX.startPrev, '<', 0.9 ) : dispBtn( btnX.startPrev, '<', 0.5 );
                startNext ? dispBtn( btnX.startNext, '>', 0.9 ) : dispBtn( btnX.startNext, '>', 0.5 );
                endPrev   ? dispBtn( btnX.endPrev,   '<', 0.9 ) : dispBtn( btnX.endPrev,   '<', 0.5 );
                endNext   ? dispBtn( btnX.endNext,   '>', 0.9 ) : dispBtn( btnX.endNext,   '>', 0.5 );
                
                return null
            } 
            
            const isXinGraph = (x >= this.graphSpaceLeft && x <= this.clientWidth  - this.graphSpaceLeft)
                            && (y >= this.graphSpaceBtn  && y <= this.clientHeight - this.graphSpaceBtn );

            if (isXinGraph) return null
            
            // remove onGrab pointer outside button & graph
            this.canvas_pointer.classList.remove('pointerOnGrab');
            // decrease opacity of button outside button & graph
            dispBtn( btnX.startPrev, '<', 0.5 );
            dispBtn( btnX.startNext, '>', 0.5 );
            dispBtn( btnX.endPrev,   '<', 0.5 );
            dispBtn( btnX.endNext,   '>', 0.5 );

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
        const dataReduced = this.dataOrig.filter( (value) => {
            const oneDate = new Date( value[this.date] );
            if ( startOrEnd === 'start' ) return ( oneDate >= updatedDate ) && ( oneDate <= new Date(this.end)   );
            if ( startOrEnd === 'end'   ) return ( oneDate <= updatedDate ) && ( oneDate >= new Date(this.start) );
        });
        // check if new array is valid
        if ( dataReduced[0] === null || dataReduced[0] === undefined || dataReduced.length < 2 ) return null; 
        return this.dataReduced = dataReduced;
    }
    

    async updateGraph(startOrEnd, move) {
        console.time('Start');
        // promis AJAX query
        if (isAllDownloaded === false) {
            try { 
                pdoResp = await loadPocasi('1999-01-01', '2099-01-01');
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
        this.refresh();
        // show fresh graph
        this.graph();
    }


    getInfo(xPos = event.offsetX, yPos = event.offsetY){

        // get coordinates inside canvas
        // const x = event.offsetX;
        // const y = event.offsetY;

        this.button.hover( xPos, yPos);

        // if mouseover is inside graph
        if (   (xPos >= this.graphSpaceLeft && xPos <= this.clientWidth  - this.graphSpaceLeft) &&
               (yPos >= this.graphSpaceBtn  && yPos <= this.clientHeight - this.graphSpaceBtn )
           ){

            this.xForInfo = xPos;
            this.yForInfo = yPos;

            // enable cursor
            this.canvas_pointer.classList.add('pointerOn');

            // clear whole canvas
            this.ctx_pointer.clearRect(0 , 0, this.clientWidth, this.clientHeight ); 

            // get date in format 2020-11-06 from event.clientX
            const valueX = (xPos - this.graphSpaceLeft) * this.xLimit / (this.clientWidth - 2 * this.graphSpaceLeft);
            const dayNumberInMs = ( this.firstDayNumber() + valueX ) * this.MILISECONDS_FOR_ONE_DAY;
            const shortDate = this.getTextDateFromNewDate( new Date(dayNumberInMs) );

            // search entry with datum
            const valueY = (this.dataReduced).find( value => value[this.date] === shortDate );

            const showInfo = () => {

                this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                // show line for x
                this.ctx_pointer.beginPath(); 
                this.ctx_pointer.fillRect(xPos, this.graphSpaceBtn, 1 , this.clientHeight - 2 * this.graphSpaceBtn ); 

                // show background for X text
                this.ctx_pointer.beginPath(); 
                this.ctx_pointer.fillRect(xPos - 40, this.graphSpaceBtn - 20, 80 , 20 ); 

                // show X text
                this.ctx_pointer.font = '12px Arial';
                this.ctx_pointer.fillStyle = 'white';
                this.ctx_pointer.textBaseline = 'middle';
                this.ctx_pointer.textAlign = 'center';
                this.ctx_pointer.fillText( ` ${ shortDate }`, xPos, this.graphSpaceBtn - 8 );

                const infoLeftY = ( type, yValue ) => {
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                    // show line for y
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillRect(this.graphSpaceLeft , yValue , xPos - this.graphSpaceLeft , 1 ); 

                    // show background for Y text
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillRect(0, yValue - 10, this.graphSpaceLeft , 20 ); 

                    // show Y text
                    this.ctx_pointer.fillStyle = 'white';
                    this.ctx_pointer.textBaseline = 'middle';
                    this.ctx_pointer.textAlign = 'right';
                    this.ctx_pointer.fillText(` ${ valueY[type] }`, this.graphSpaceLeft, yValue );
                }
                const infoRightY = ( type, yValue ) => {
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)"; 
                    // show line for y second
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillRect(xPos, yValue, this.clientWidth - this.graphSpaceLeft - xPos, 1 ); 

                    // show background for Y second text
                    this.ctx_pointer.beginPath(); 
                    this.ctx_pointer.fillRect(this.clientWidth - this.graphSpaceLeft, yValue - 10, this.graphSpaceLeft , 20 ); 

                    // show Y second text
                    this.ctx_pointer.fillStyle = 'white';
                    this.ctx_pointer.textBaseline = 'middle';
                    this.ctx_pointer.textAlign = 'left';
                    this.ctx_pointer.fillText(` ${ valueY[type] }`, this.clientWidth - this.graphSpaceLeft, yValue );
                }

                // calculate y for graph 
                const y = this.yPositionFromDate(valueY[this.type], this.min, this.max);
                
                if ( !this.second_type ) {
                    if ( this.yTextPlace === 'left' ) {
                        infoLeftY( this.type, y );
                        return null
                    } 

                    infoRightY(this.type, y);
                    return null;
                }

                // 2nd graph in canvas
                const ySecond = this.yPositionFromDate(valueY[this.second_type], this.minSecond, this.maxSecond);
                
                if ( this.yTextPlace === 'right' ) {
                    infoRightY(this.type, y);
                    infoLeftY( this.second_type, ySecond );
                    return null
                }

                infoLeftY( this.type, y );
                infoRightY(this.second_type, ySecond);
            }

            if (!valueY) return null;
            
            showInfo();
            
            return null

        }
        
        // disable cursor
        this.canvas_pointer.classList.remove('pointerOn');

    }

    resizeCanvas() {
        this.clientWidth  = canvas.clientWidth;
        this.clientHeight = canvas.clientHeight;
        this.graph();
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
        for(let number = 10; number >= 0; number-- ) {
            this.textAndAxesXY(number);
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
        return new Date(this.start).getTime() / this.MILISECONDS_FOR_ONE_DAY
    }

    lastDayNumber() { 
        return new Date(this.end).getTime()   / this.MILISECONDS_FOR_ONE_DAY
    }

    yearLine() {
        const firstYear = new Date( this.start ).getFullYear();
        const lastYear  = new Date( this.end   ).getFullYear();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([1, 0]);
        for (let year = firstYear + 1; year <= lastYear; year++) {
            // line for year
            this.ctx.moveTo( this.xPositionFromDate(`${year}-01-01`), this.graphSpaceBtn );
            this.ctx.lineTo( this.xPositionFromDate(`${year}-01-01`), this.clientHeight - this.graphSpaceBtn );
            // text for year
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText( `${year}`, this.xPositionFromDate(`${year}-01-01`), this.graphSpaceBtn );
        }
        this.ctx.stroke();
    }

    // calculate day number started from 0
    xValueFromDate( date ) {
        const myDate = new Date( date );
        const dayNumber =  myDate.getTime() / ( 1000 * 60 * 60 *24 ) ;
        return dayNumber - this.firstDayNumber();
    }

    textHeader() {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'center';
        this.yTextPlace === 'right' ? this.ctx.fillText(this.header, this.clientWidth / 2, 0)  : null;
        this.yTextPlace === 'left'  ? this.ctx.fillText(this.header, this.clientWidth / 2, 20) : null;
    }

    // lines + text for axes X, Y
    textAndAxesXY(number) {

        const Y = this.clientHeight - this.graphSpaceBtn  - (this.clientHeight - 2 * this.graphSpaceBtn ) * number / 10;
        const X = this.clientWidth  - this.graphSpaceLeft - (this.clientWidth  - 2 * this.graphSpaceLeft) * number / 10;
        // axes X 
        this.ctx.moveTo( this.graphSpaceLeft                   , Y );
        this.ctx.lineTo( this.clientWidth - this.graphSpaceLeft, Y );
        // axes Y
        this.ctx.moveTo( X, this.graphSpaceBtn );
        this.ctx.lineTo( X, this.clientHeight - this.graphSpaceBtn);

        const miliSec = ( 1000 * 60 * 60 *24 ) * ( this.firstDayNumber() + this.xLimit * (10 - number) / 10 );
        const dateX = new Date(miliSec);
        const year = '' + dateX.getFullYear();
        const month = 1 + dateX.getMonth();
        const day = dateX.getDate();
        
        // text for axes X
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.save();
        this.ctx.translate( X, this.clientHeight - this.graphSpaceBtn );
        this.ctx.rotate( - Math.PI / 4);
        this.ctx.textBaseline = 'hanging';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${day}.${month}.`, 0, 0);
        this.ctx.restore();
        
        // text for axes Y
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = 'middle';
        const yText = ` ${ ( this.min + (this.yLimit) * number / 10 ).toFixed(1) } `;
        if ( this.yTextPlace === 'right' ) {
            this.ctx.textAlign = 'left';
            this.ctx.fillText( yText, this.clientWidth - this.graphSpaceLeft, Y );
        } else {
            this.ctx.textAlign = 'right'
            this.ctx.fillText( yText, this.graphSpaceLeft, Y );
        }
    }


    xPositionFromDate( date ){
        return this.graphSpaceLeft + this.xValueFromDate(date) * (this.clientWidth  - 2 * this.graphSpaceLeft) / this.xLimit
    }

    yPositionFromDate( value, min, max ){
        return this.graphSpaceBtn + (max - value)         * (this.clientHeight - 2 * this.graphSpaceBtn ) / (max - min)
    }

    graph() {

        // show axess
        this.axesXY();

        // values to graph
        const line = oneEntry => {
            this.ctx.lineTo( this.xPositionFromDate(oneEntry[this.date]), this.yPositionFromDate(oneEntry[this.type], this.min, this.max) )
        }
        this.ctx.beginPath();
        //this.ctx.moveTo(0,0)
        this.ctx.setLineDash([0]);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.dataReduced.forEach( oneEntry => line(oneEntry) );
        //this.ctx.closePath();
        this.ctx.stroke();

        // get data from graph
        this.getInfo(this.xForInfo, this.yForInfo);
    }
}
