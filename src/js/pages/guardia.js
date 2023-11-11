function configurateGaurdia() {
    cardRepository.get(atob(trelloCardGuardiaId)).then(data => {

        data.forEach(m => m.fecha = new Date((new Date()).getFullYear(), Number(m.arranca.split('/')[1]) - 1, m.arranca.split('/')[0]));
        data.forEach(m => m.hasta = m.fecha.addDays(7));
        let user = data.find(p => checkBetween(p.fecha, p.hasta, new Date()));

        $('.who', '.guardia').removeClass('waiting');
        $('.t_name', '.guardia').text(user?.nominado);
        $('.t_date', '.guardia').text('Hasta el ' + format(user?.hasta));

        function format(d) {
            if (!d) return null;

            return d.getDate() + '/' + (d.getMonth() + 1);
        }
    });
}
