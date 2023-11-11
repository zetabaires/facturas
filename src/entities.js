function AppWindow() {

    this._activePage = null;
    this._activePageNumber = 0;
    this._pages = [];

    // Events
    this._actions = [
        new BeforeAfterEventHandler('onSetActivePage'),
        new BeforeAfterEventHandler('onSetActivePageNumber'),
        new BeforeAfterEventHandler('onAddPage'),
    ].map(m => m.getHandlers()).reduce((a, b) => a.concat(b));
    this.attach = e => attach(this._actions, e);
    this.emit = e => emit(this._actions, e);

    this.getPages = () => this._pages;
    this.getActivePageNumber = () => this._activePageNumber;

    // Agrega una página a la vista
    this.addPage = p => {
        this.emit(new EventArg('onAddPageBefore', p))
        p.attach(new Event('onSetActiveAfter', (p, v) => v ? this.setActivePage(p.number) : false));

        this._pages.push(p)
        if (this._activePageNumber === p.number && !p.isActive()) p.activate();

        this.emit(new EventArg('onAddPageAfter', p))
    };

    // Setea el número de la pagina activa
    this.setActivePageNumber = (pNumber) => {
        this.emit(new EventArg('onSetActivePageNumberBefore', pNumber))

        this._activePageNumber = pNumber;

        this.emit(new EventArg('onSetActivePageNumberAfter', pNumber))
    }

    // Setea la página activa
    this.setActivePage = (pNumber) => {
        this.emit(new EventArg('onSetActivePageBefore', pNumber))

        if(pNumber == this._activePageNumber) return;

        let _p = this._pages.find(m => m.number == pNumber);
        if (!_p) throw new Error(`Page id: ${pNumber} not found`);

        this._activePage = _p;
        this.setActivePageNumber(_p.number);

        this._pages.filter(p => p !== _p).forEach(p => p.deactivate());
        if(!_p.isActive()) _p.activate();

        this.emit(new EventArg('onSetActivePageAfter', _p))
    }
}

function Page(id, number, element) {

    this.id = id;
    this.number = number;
    this.element = element;

    this._isActive = false;

    // Events
    this._actions = [
        new BeforeAfterEventHandler('onSetActive'),
    ].map(m => m.getHandlers()).reduce((a, b) => a.concat(b));

    this.attach = e => attach(this._actions, e);
    this.emit = (e) => emit(this._actions, e);

    this.setActive = (v) => {
        this.emit(new EventArg('onSetActiveBefore', this, this._isActive));

        this._isActive = v;

        this.emit(new EventArg('onSetActiveAfter', this, v));
    };
    this.activate = () => this.setActive(true);
    this.deactivate = () => this.setActive(false);
    this.isActive = () => this._isActive;
}

function BeforeAfterEventHandler(id) {
    this.id = id;
    this.before = [];
    this.after = [];

    this.getHandlers = () => [
        new Event(this.id + 'Before', () => this.before),
        new Event(this.id + 'After', () => this.after),
    ]
}

function Interceptor(process, type, func) {
    this.process = process;
    this.type = type;
    this.func = func;

    this.excec = (...args) => func(...args);
}

function Event(name, func) {
    this.name = name;
    this.func = func;
}

function EventArg(name, ...args) {
    this.name = name;
    this.args = args;
}

function Consumer(action) {
    this._action = action;
    this.receive = this._action;
}

function Topic(events) {
    this._consumers = [];
    const $this = this;

    this.events = events;

    this.subscribe = (consumer) => {
        this._consumers.push(consumer);
    };

    this.emit = (msg) => {
        this._consumers.forEach(m => m.receive(msg));
    }

    this.events.forEach(event => {
        // console.log('attach')
        event.func((e) => $this.emit({ name: event.name, arg: e }))
    });
}