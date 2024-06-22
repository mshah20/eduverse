export const isAnyStringEmpty = (arrayOfStrings) => {
    let result = false;
    
    arrayOfStrings.forEach((string) => {
        if(string === null || string === '' || string.trim() === '') {
            result = true;
        }
    })
    
    return result;
}