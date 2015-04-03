module.exports = {
	'Sprint App Load' : function (browser) {
		browser
			.url('http://localhost:1337/')
			.waitForElementVisible('body', 1000)
			.assert.containsText('.lead','SprintRPC')
			.end();
	},

	'Add New Record test' : function (browser) {
		browser
			.url('http://localhost:1337/add')
			.waitForElementVisible('form', 1000)
			.setValue('#title', 'Test')
			.setValue('#bz-query', 'https://bugzilla.redhat.com/jsonrpc.cgi?method=Bug.search&params=%5B%7B"limit"%3A"200"%2C"target_release"%3A"3.4"%7D%5D')
			.click('#submit')
			.pause(1000)
			.assert.value('#title', '')
			.assert.value('#bz-query', '')
			.perform(function () {
				console.log('Successful Entry to DB');
			})
			.end();
	}
};