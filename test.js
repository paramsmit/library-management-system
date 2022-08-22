const date = new Date();

// console.log(date);
// console.log(date.getMonth());
// month is 0 based so it is returning 6 
// console.log(date.toISOString());

const newdate = new Date();

newdate.setDate(date.getDate() + 30);

// const parsedDate = new Date(date.toLocaleDateString());


console.log(date.toISOString());
console.log(newdate.toISOString());

