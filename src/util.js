

function buffStr(data){
  return String(data).length === 1 ? `0${data}` : data
}
exports.transferTime = function (Dtime) {
    let date = new Date(Dtime);
    let year = date.getFullYear();
    let month = buffStr(date.getMonth() + 1);
    let day = buffStr(date.getDate());
    let hours = buffStr(date.getHours());
    let minutes = buffStr(date.getMinutes());
    let seconds = buffStr(date.getSeconds());
   
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}

exports.objArrSort = function (objArr) {
    return Object.entries(objArr).sort((a, b) => b[1] - a[1])
}