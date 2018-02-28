module.exports = function({method, path}, callback) {
	if (!callback){
		console.error('Указать функцию обратного вызова для запроса')
		return null;
	}
	if (!method) method = 'GET';

	const self = this;
	const apiRequest = new XMLHttpRequest();
	
	apiRequest.onreadystatechange = () => {
		// запрос завершен -> проверить статус
		if (apiRequest.readyState == 4) {
			// запрос был получен без ошибок -> но теперь должен быть проверен
			if (apiRequest.status == 200) {
				let parsedResponse = null;
				try {
					parsedResponse = JSON.parse(apiRequest.responseText);
				} catch (e) {
					console.warn('bad JSON response', e);
				}
				callback(parsedResponse || apiRequest.responseText || null)
			} else {
				// запрос провалился -> выдать ошибку и сделать функцию обратного вызова
				console.error('requestError', {apiRequest});
				callback(null)
			}
		}
	}

	apiRequest.open(method, path, true);
	apiRequest.send();
}