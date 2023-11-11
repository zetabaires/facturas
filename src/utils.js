Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.format = function () {
    var date = new Date(this.valueOf());
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

jQuery.each(["put", "delete"], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});

function toPage(view, page) {
    view.scrollTo(view.clientWidth * (page - 1), 0);
}

function checkBetween(d1, d2, d2compare) {
    let compare = d2compare >= d1 && d2compare <= d2;
    return compare;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function emit(_actions, e) {
    let _a = _actions.find(m => m.name == e.name);
    if (!_a) throw new Error(`[emit] Action: ${e.name} not found`);

    _a.func().forEach(t => t.func(...e.args))
}

function attach(_actions, e) {
    let _a = _actions.find(m => m.name == e.name);
    if (!_a) throw new Error(`[attach] Action: ${e.name} not found`);

    _a.func().push(e);
};