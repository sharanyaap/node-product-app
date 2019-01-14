/**
 * Created by sharanya.p on 11/19/2018.
 */
function add(a,b){
    console.log("add",a,b);
    return a+b;
}
// common.js (specification)
exports.add = add;

exports.sub = function (a,b) {
    return a-b;
}
