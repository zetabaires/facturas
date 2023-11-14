function configurateLicencias() {
    cardRepository.get(atob(trelloCardLicenciasId)).then(data => {
        const TODAY = (new Date()).setHours(0, 0, 0, 0);
        
        data.forEach(m => m.fecha = new Date(20 + m.date.split('/')[2], Number(m.date.split('/')[1]) - 1, m.date.split('/')[0]));
        let user = data
            .filter(m => m.fecha.getTime() >= TODAY)
            .sort((p1, p2) => {
                if (p1.fecha.getTime() < p2.fecha.getTime()) return -1;
                if (p1.fecha.getTime() > p2.fecha.getTime()) return 1;
                return 0
            })[0];

        $('.who', '.licencias').removeClass('waiting');
        $('.t_name', '.licencias').text(user?.name);
        $('.t_date', '.licencias').text('El ' + format(user?.fecha));
        $('.t_reason', '.licencias').text('Por ' + user?.type);

        function format(d) {
            if (!d) return null;

            return d.getDate() + '/' + (d.getMonth() + 1);
        }
    });
}
