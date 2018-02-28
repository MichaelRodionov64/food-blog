import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import moment from 'moment';
import request from '../request';
import Loader from '../common/loader';

class Article extends Component {
	constructor(props) {
		super(props)
		this.state = {article: null, error: null};
	}

	componentDidMount() {
		const {articleId, appTitle} = this.props;
		const self = this;

		document.title = `⏳ | ${appTitle}`;

		// загрузить статью с сервера
		request({path: `/data/article/${articleId}`}, article => {
			if (article.e) {
				document.title = `Ошибка 😢 | ${appTitle}`;
				self.setState({error: true})
			} else {
				document.title = `${article.title} | ${appTitle}`;
				self.setState({article, error: null});
			}
		});
	}

	renderError() {
		return (
			<div class="error-message">
				<h1>
					404
				</h1>
				<h3>
					Статья не найдена 😢
				</h3>
			</div>
		)
	}

	render() {
		const {article, error} = this.state;
		if (error) return this.renderError();
		if (!article) return <Loader message="Загружаю статью" />;

		const created = moment(article.created_at).format('DD-MM-YYYY | HH:mm');
		const metadata = article.metadata || {};
		const author = metadata.author ||  '';
		const pic = metadata.profile_picture || {url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}; // пустая git, если картинка отсутствует

		return (
			<article>
				<header>					
					<h2>
						{article.title}
					</h2>
					
					<div className="author">
						<div className="profile-pic">
							<img src={pic.url} />
						</div>
						<span>
							<b>{author}</b>
						</span>
					</div>
				</header>

				<hr />

				{renderHTML(article.content)}

				<hr />

				<time className="created" dateTime={article.created_at}>
					{created}
				</time>
			</article>
		)
	}
}

export default Article;