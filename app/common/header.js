import React, {Component} from 'react';

const LOGO_URL = 'https://www.flaticon.com/premium-icon/icons/svg/562/562678.svg';

class Header extends Component {
	constructor(props) {
		super(props)
	}

	renderPageLinks(pages = [], pathname = '') {
		const [ base, id ] = pathname.split('/').slice(1);
		const isPage = (base == 'page');

		return pages.map(page =>
			<li key={`page-${page.slug}`}>
				<a href={`/page/${page.slug}`} className={(isPage && id == page.slug) ? 'active' : ''}>
					{page.title}
				</a>
			</li>
		);
	}

	render() {
		const {title, pages, pathname, clearCache} = this.props;
		
		return (
			<header>
				<a href="/">
					<img src={LOGO_URL} width="30" height="30" />
					<h1>
						{title}
					</h1>
				</a>

				<nav>
					<ul>
						{this.renderPageLinks(pages, pathname)}
					</ul>
				</nav>
			</header>
		);
	}
}

export default Header;