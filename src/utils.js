export function adjustTimezone(date) {  
    const offset = -3;
    const adjustedDate = new Date(date); 
    adjustedDate.setHours(adjustedDate.getHours() + offset);  
    return adjustedDate; 
}