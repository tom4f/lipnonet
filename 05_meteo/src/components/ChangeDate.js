
// handling border values
// interval = what set / direction = inc or decrement

export const ChangeDate = (dateType, dateObj, interval, direction) => {
    let start;
    switch (dateType) {
        case 'daily' : start = new Date(2012,9,1);
        break;
        case 'yearSum' : start = new Date(2012,8);
        break;
        case 'davisStat' : start = new Date(2012,9,1);
        break;
        default:
    }
  
    const now  = new Date();
    let newDate;
    switch (interval) {
        case 'day' : newDate  = new Date( dateObj.setDate( dateObj.getDate() + direction ) );
        break;
        case 'month' : newDate  = new Date( dateObj.setMonth( dateObj.getMonth() + direction ) );
        break;
        case 'year' : newDate  = new Date( dateObj.setFullYear( dateObj.getFullYear() + direction ) );
        break;
        default:
    }
    if (direction === -1) {
        console.log('=================================');
        console.log(start);
        console.log(' < (-1) ');
        console.log(newDate);
        const minus = start < newDate ? newDate : start;
        console.log(minus);
        return minus;
    } 
    if (direction === +1) {
        console.log('=================================');
        console.log(now);
        console.log(' > (+1) ');
        console.log(newDate);
        const plus = now > newDate ? newDate : now
        console.log(plus);
        return plus;
    }
}