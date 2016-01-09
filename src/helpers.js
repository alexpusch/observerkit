export function removeFromArray(array, item){
  let index = array.indexOf(item);
  if ( index > -1){
    array.splice(index, 1);
  }
}

export function shallowCopy(array){
  let newArray = [];
  for(let i in array){
    newArray[i] = array[i];
  }

  return newArray;
}