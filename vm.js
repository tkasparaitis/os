function VM (type) {
    this.type = type;
    this.color = "red";
}
 
VM.prototype.getInfo = function() {
    return this.color + ' ' + this.type + ' apple';
};