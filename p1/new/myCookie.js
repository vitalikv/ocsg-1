


class MyCookie
{
	constructor()
	{

	}
	
	setCookie({token})
	{
		document.cookie = "token="+token+"; path=/; max-age=120";
		
		console.log('setCookie', document.cookie, this.getCookie('token'));
	}
	
	getCookie(name) 
	{
		const matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
		
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}	
	
	deleteCookie()
	{
		const token = this.getCookie('token');
		console.log('deleteCookie', document.cookie, token);
		if(!token) return;
		
		document.cookie = "token="+token+"; path=/; max-age=0";	// удаляем cookie
		
		console.log('deleteCookie', document.cookie);
	}
}














