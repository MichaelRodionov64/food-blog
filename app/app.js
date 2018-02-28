import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import request from './request';
import moment from 'moment';
import Home from './home';
import Article from './article';
import Page from './page';
import Header from './common/header';
import Sidebar from './common/sidebar';
import Loader from './common/loader';
import './styles/base.less';

const TITLE = document.title;

class App extends Component{
	constructor(props) {
		super(props);
		let pathname = window.location.pathname;

		const currentPage = window.localStorage.getItem('currentPage') || 0;

		this.state = { articles: [], pathname, currentPage};
		this.next = () => this.nextPage();
		this.clearCache = () => this.clearStorage();
	}

	componentDidMount() {
		let preserveCache = window.localStorage.getItem('lastCached') || false;
		if (preserveCache) {
			preserveCache = moment(preserveCache);
			
			const now = moment();
			const diff = now.diff(preserveCache);

			preserveCache = !((diff / (1000 * 60)) > 5);

			console.log('Кеш сохранен', preserveCache);
		}
		if (!preserveCache) window.localStorage.setItem('lastCached', moment().format());

		this.getList('articles', undefined, preserveCache); // получить список статей и метаданные
		this.getList('pages', null, preserveCache); // получить список страниц и метаданные
	}

	clearStorage() {
		// очистить localStorage статей для следующего обновления
		window.localStorage.setItem('lastCached', '');
		window.localStorage.setItem('currentPage', '');
		window.localStorage.setItem('articles', '');
		window.localStorage.setItem('pages', '');
	}

	updateListState(name = 'articles', items, skipConcat = false) {
		switch(name){
			case 'articles':
				let articles = (skipConcat) ? items : this.state.articles.concat(items);
				this.setState({articles})
				window.localStorage.setItem(name, JSON.stringify(articles));
				break;
			case 'pages':
				this.setState({pages: items});
				window.localStorage.setItem(name, JSON.stringify(items));
				break;
		}
	}

	fetchList(name = 'articles', page = 0){
		const self = this;
		// скачать и обновить кеш
		request({ path: `/data/${name}/${ page !== null ? page : ''}` }, items => {
			if (!Array.isArray(items)){
				console.error('could not fetch articles from CosmicJS');
				return
			}
			// настроить кеш
			this.updateListState(name, items);
		});
	}

	getList(name = 'articles', page, preserveCache = true){
		let cache = window.localStorage.getItem(name);

		if (preserveCache && cache){
			console.log('Получаю из кеша...');

			let items = null;

			try{
				items = JSON.parse(cache);
			} catch(e){
				console.warn('Не могу прочитать из кеша', e)
			}

			if (items && items.length > 0) {
				this.updateListState(name, items, true);
			} else {
				this.fetchList(name, page);
			}
		} else {
			this.fetchList(name, page);
		}
	}

	nextPage() {
		let {currentPage} = this.state;
		this.fetchList('articles', ++currentPage);
		window.localStorage.setItem('currentPage', currentPage);
		this.setState({ currentPage })
	}

	route() {
		const {pathname, articles} = this.state;
		const [base, id] = pathname.split('/').slice(1);

		if (articles.length > 0){
			switch (base){
				case '':
					return <Home appTitle={TITLE} articles={articles} next={this.next}/>; break;
				case 'article': // article route
					return <Article appTitle={TITLE} articleId={id} />; break
				case 'page': // page route
					return <Page appTitle={TITLE} pageId={id} />; break
			}
		}

		return <Loader msg="⏳ Загружаю статьи..." />;
	}

	render() {
		const {articles, pages, pathname} = this.state;

		return (
			<div className="app-container">
				<Header title={TITLE} pathname={pathname} pages={pages} clearCache={this.clearCache} />
				<Sidebar articles={articles} pathname={pathname} next={this.next} />
				<main>{this.route()}</main>
			</div>
		);
	}
}

const AppContainer = document.getElementById('app');

if (AppContainer) {
	ReactDOM.render(<App />, AppContainer);
} else {
	console.error('Нет активного элемента');
}