const addDays = (date, days) => {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + days);
}

module.exports = {
    addDays
}