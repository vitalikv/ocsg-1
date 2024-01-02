
// окно с обзором программы
class WindDivAbout
{
	container;
	content;
	wrapVideo;
	
	init()
	{
		this.container = this.createDiv();
		this.content = this.container.querySelector('[nameId="content"]');
		this.wrapVideo = this.content.querySelector('[nameId="wrapVideo"]');
	}
	
	createDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];		
	}	
	
	html_1()
	{
		const cssHeader = 
		`display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;`;

		const cssVideo = 
		`width: 700px;
		height: 400px;`;
		
		const html = 
		`<div style="display: none;"> 
			<div style="${cssHeader}">Обзор программы</div>
			<div nameId="content" style="${cssVideo}">
				<div nameId="wrapVideo" style="width: 100%; height: 100%;"></div>
			</div>
		</div>`;

		return html;
	}
	

	// показываем видео (обзор на программу)
	showVideo()
	{
		// первое открытие
		if(this.wrapVideo.innerHTML === '')
		{
			const ht = `https:/`;
			const video = `${ht}/www.youtube.com/embed/1hV98LTygwk`;
			this.wrapVideo.innerHTML = `<iframe width="100%" height="100%" src="${video}" frameborder="0" allowfullscreen></iframe>`;			
		}
	}	
}







