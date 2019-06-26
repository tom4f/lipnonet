
let myArray = [
    'Tomas',
    1976,
    'Dacice',
    'Olinka'
]

// function myForeachFunction (value, index, arr){
//     console.log(`
//         value: ${value},
//         index: ${index},
//         array: ${arr}
//     `);
// }


const myForeachFunction = (value, index, array) => console.log(`
        value: ${value},
        index: ${index},
        array: ${array}
    `);

myArray.forEach(myForeachFunction);