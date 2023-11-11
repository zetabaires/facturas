function CurrentPageRepository() {
    const $this = this;

    $this.interceptors = [];

    $this.changePage = (page) => {
        excecProcess(
            'changePage',
            () => {
                localStorage.setItem('current_page', page);
                return page;
            },
            page)
    }

    $this.getCurrentPage = () => {
        return excecProcess('getCurrentPage', () => Number(localStorage.getItem('current_page') || 0))
    }

    $this.addInterceptor = (process, type, func) => {
        $this.interceptors.push(new Interceptor(process, type, func));
    }

    function excecProcess(process, func, ...paramArguments) {
        getInterceptors(process, 'before').forEach(m => m.excec(paramArguments));

        let result = func();

        getInterceptors(process, 'after').forEach(m => m.excec(result));

        return result;
    }

    function getInterceptors(process, type) {
        return $this.interceptors.filter(m => m.process == process && (!type || m.type == type));
    }
}
