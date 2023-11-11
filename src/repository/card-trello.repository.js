function CardTrelloRepository(key, token) {

    const _key = key;
    const _token = token;
    const _url = 'https://api.trello.com/1/';

    this.get = async (id) => {
        return _get(_url + 'cards/' + id).then(m => JSON.parse(m.desc || '{}'));
    }

    this.update = async (id, data) => {
        return _put(_url + 'cards/' + id, { desc: JSON.stringify(data) })
    }

    async function _get(url) {
        const _url = _getUrl(url);

        return new Promise((resolver, error) => {
            $.get(_url, data => {
                resolver(data);
            })
        });
    }

    async function _put(url, body) {
        const _url = _getUrl(url);

        console.log(body);
        return new Promise((resolver, error) => {
            $.put(_url, body, data => resolver(data));
        });
    }

    function _getUrl(url) {
        return url + `?key=${_key}&token=${atob(_token)}`;
    }
}
