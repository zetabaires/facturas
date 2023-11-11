let timer = null;
let lock = false;

const WINDOW_TOPIC = new Topic([
    new Event('ready', f => $(document).ready(f)),
    // new Event('visibility', f => $('.random').on('visibility', f)),
    new Event('focus', f => $(window).on('focus', f)),
    new Event('blur', f => $(window).on('blur', f))
]);

const PAGE_TOPIC = new Topic([
    new Event('activePageChange', f => appWindow.attach(new Event('onSetActivePageAfter', f)))
]);

WINDOW_TOPIC.subscribe(new Consumer((event) => {
    const skipInit = event.name == 'blur';
    initTimer(event, skipInit);
}));

PAGE_TOPIC.subscribe(new Consumer((event) => {
    initTimer(event);
}));

function initTimer(event, skipInit) {
    if (!skipInit && INTERVAL_PAGES.includes(appWindow.getActivePageNumber())) {
        timerProcess(event.name, INTERVAL_TIME, refreshRandom);
        refreshRandom()
    }
    else if (timer) {
        timer = clearTimeout(timer);
        console.log('clearTimeout', event)
    }
}

function timerProcess(eventName, time, func) {
    // return;
    console.log('init timer', (time / 1000) + 's')
    timer = setTimeout(() => {
        console.log(new Date(), `[${eventName}]`);
        func()

        clearTimeout(timer);
        timerProcess(eventName.includes('inner') ? eventName : 'inner-' + eventName, time, func);
    }, time);
}

async function newRandom() {
    if(lock) return;
    lock = true;

    $('.who', '.random').addClass('waiting');
    $('.t_name', '.random').text('');
    $('.t_last', '.random').text('');

    let pIntegrantes = cardRepository.get(atob(trelloCardIntegrantesId));
    let pRandom = cardRepository.get(atob(trelloCardRandomId));

    await Promise.all([pIntegrantes, pRandom]);

    let integrantes = await pIntegrantes;
    let random = await pRandom;

    let filter = integrantes
        .filter(m => m.toLowerCase() != random?.lastSelected?.toLowerCase());

    let index = getRandomInt(filter.length);

    let newAssign = filter[index];

    random.lastSelected = random.selected;
    random.selected = newAssign;

    await cardRepository.update(atob(trelloCardRandomId), random);

    refreshRandomPage(random, '');

    lock = false;
}

function refreshRandom() {
    if(lock) return;

    cardRepository.get(atob(trelloCardRandomId)).then(data => {
        if(lock) return;
        refreshRandomPage(data);
    })
}

function refreshRandomPage(data) {
    $('.who', '.random').removeClass('waiting');
    $('.t_last', '.random').text('anterior >' + data?.lastSelected);
    $('.t_name', '.random').text(data?.selected);
}