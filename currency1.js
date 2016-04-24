var Currency = function (canadianDollar) {
	this.canadianDollar = canadianDollar;
}
Currency.prototype.roundTwoDecimals = function (amount) {
	return Math.round(amount * 100) / 100;
}
Currency.prototype.canadianToUS = function(canadian) {
	return this.roundTwoDecimals(canadian * this.canadianDollar);
}
Currency.prototype.USTocanadian = function(us) {
	return this.roundTwoDecimals(us / this.canadianDollar);
}
//exports = Currency;
module.exports = Currency;