export function calculateRunTime(data: string[]){
    return data.filter(value => value === '1').length;
}

export function meanRunTime(data: string[]){
    return calculateRunTime(data)/data.length;
}