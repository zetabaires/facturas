function configurateFacturas() {
    let urlCard = `https://api.trello.com/1/cards/${atob(trelloCardId)}/checklists?key=${key}&token=${atob(token)}`;

    $.get(urlCard, function (data) {
        let card = data[0];

        let date = new Date().addDays(6 - new Date().getDay() - 1 );
        let count = 0;

        let t_data = card.checkItems.filter(m => m.state != 'complete').sort((m, n) => m.pos - n.pos).map(m => m.name).map(m => ({ name: m, date: date.addDays(7 * (count++)).format() }));

        let first = t_data[0];
        let t_name = first.name;
        let t_date = first.date;

        $('.who', '.facturas').removeClass('waiting');
        $('.t_name', '.facturas').text(t_name);
        $('.t_date', '.facturas').text(t_date);
    })
}
