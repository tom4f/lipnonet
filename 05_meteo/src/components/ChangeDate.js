
// handling border values
// interval = what set / direction = inc or decrement

const ChangeDate = (dateType, dateObj, interval, direction) => {
    let start;
    switch (dateType) {
        case 'daily' : start = new Date(2012,9,1);
        break;
        case 'yearSum' : start = new Date(2012,8);
        break;
        case 'davisStat' : start = new Date(2012,9,1);
    }
  
    const now  = new Date();
    let newDate;
    switch (interval) {
        case 'day' : newDate  = new Date( dateObj.setDate( dateObj.getDate() + direction ) );
        break;
        case 'month' : newDate  = new Date( dateObj.setMonth( dateObj.getMonth() + direction ) );
        break;
        case 'year' : newDate  = new Date( dateObj.setFullYear( dateObj.getFullYear() + direction ) );
    }
    if (direction === -1) return start < newDate ? newDate : start;
    if (direction === +1) return now > newDate ? newDate : now;
}

export default ChangeDate;