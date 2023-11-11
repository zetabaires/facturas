function PagePlugin(appWindow) {

    this.init = (viewIdentifier, pageIdentifier) => {
        // Obtiene una referencia a la view
        const view = document.querySelector(viewIdentifier);

        // Se attacha al evento de seteo de página para actualizar el tag de HTML
        appWindow.attach(new Event('onSetActivePageAfter', p => {
            let total = appWindow.getPages().length;

            $(view)
                .attr('data-page', p.number)
                .attr('data-total-pages', total)
                .attr('data-is-first', p.number == 1)
                .attr('data-is-last', p.number == total);
        }))

        // Carga las pantallar sobre la appWindow
        $(pageIdentifier, view).each((i, m) => {
            let _j = $(m);
            appWindow.addPage(new Page(_j.data('page'), _j.data('page-number'), _j.get(0)));
        })

        // Se ejecuta cuando se de click a las flechas
        onArrowChanged(view, (direction) =>
            toPage(view, appWindow.getActivePageNumber() + (direction == 'left' ? -1 : 1)))

        // Se ejecuta durante el scroll de la pantalla
        onPageChanged(view, (page) => {
            if (appWindow.getActivePageNumber() == page) return;
            appWindow.setActivePage(page)
        })

        // Se ejecuta al cargar la pantalla
        onHashUrl(data => {
            let page = appWindow.getActivePageNumber();

            let urlPage = data.find(m => m.prop == 'page');
            if (urlPage) {
                // console.log('url page:', urlPage.value)
                let pageNumber = $(`[data-page=${urlPage.value}]`).data('page-number');
                // console.log('url page number:', pageNumber)
                page = Number(pageNumber);
            };

            // Cambia a la página especificada
            toPage(view, page);
        })
    }
}

function onHashUrl(func) {
    let data = location.hash.substring(1).split('&').map(m => ({ prop: m.split('=')[0], value: m.split('=')[1] })).filter(m => !!m.value);
    location.hash = '';

    func(data);
}

function onPageChanged(view, func) {
    view.onscrollend = (e) => {
        let page = Math.ceil(view.scrollLeft / view.clientWidth) + 1;

        func(page);
    }
}

function onArrowChanged(view, func) {
    $('.arrow', view).on('click', function (e) {
        const direction = $(this).data('direction');

        func(direction);
    });
}