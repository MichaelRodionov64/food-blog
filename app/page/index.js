import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import request from '../request';
import Loader from '../common/loader';

class Article extends Component {
	constructor(props){
		super(props)
		this.state = {page: null, error: null};
	}

	componentDidMount(){
		const {pageId, appTitle} = this.props;
		const self = this;

		// загрузить статью с сервера
		request({path: `/data/page/${pageId}` }, page => {
			if (page.e) {
				document.title = `Ошибка 😢 | ${appTitle}`;
				self.setState({error: true})
			} else {
				document.title = `${page.title} | ${appTitle}`;
				self.setState({page, error: null});
			}
		});
	}

	renderError(){
		return (
			<div class="error-message">
				<h1>
					404
				</h1>

				<h3>
					Страница не найдена 😢
				</h3>
			
				<br/>
				
				<a href="/">
					<h3>Перейдите на главную страницу</h3>
				</a>
			</div>
		)
	}

	render(){
		const { page, error } = this.state;
		
		if (error) return this.renderError();
		if (!page) return <Loader message="Загружаю страницу ⏳" />;

		return (
			<section className={`page page-${page.slug}`}>
				<header>
					<h2>
						{page.title}
					</h2>
				</header>

				<hr />

				{renderHTML(page.content)}
			</section>
		)
	}
}

export default Article;
