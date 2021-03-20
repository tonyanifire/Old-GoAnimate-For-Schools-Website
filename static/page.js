const sessions = require('../data/sessions');
const fUtil = require('../fileUtil');
const stuff = require('./info');

function toAttrString(table) {
	return typeof (table) == 'object' ? Object.keys(table).filter(key => table[key] !== null).map(key =>
		`${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`).join('&') : table.replace(/"/g, "\\\"");
}
function toParamString(table) {
	return Object.keys(table).map(key =>
		`<param name="${key}" value="${toAttrString(table[key])}">`
	).join(' ');
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs).map(key =>
		`${key}="${attrs[key].replace(/"/g, "\\\"")}"`
	).join(' ')}>${toParamString(params)}</object>`;
}

module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case '/cc': {
			title = 'Character Creator';
			attrs = {
				data: process.env.SWF_URL + '/cc.swf', // data: 'cc.swf',
				type: 'application/x-shockwave-flash', id: 'char_creator', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>',
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'original_asset_id': query['id'] || null,
					'themeId': 'business', 'ut': 60, 'bs': 'default', 'appCode': 'go', 'page': '', 'siteId': 'go',
					'm_mode': 'school', 'isLogin': 'Y', 'isEmbed': 1, 'ctc': 'go', 'tlang': 'en_US',
				},
				allowScriptAccess: 'always',
				movie: process.env.SWF_URL + '/cc.swf', // 'http://localhost/cc.swf'
			};
			break;
		}

		case '/go_full': {
			let presave = query.movieId && query.movieId.startsWith('m') ? query.movieId :
				`m-${fUtil[query.noAutosave ? 'getNextFileId' : 'fillNextFileId']('movie-', '.xml')}`;
			title = 'Video Editor';
			attrs = {
				data: process.env.SWF_URL + '/go_full.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'isEmbed': 1, 'ctc': 'go',
					'ut': 60, 'bs': 'default', 'appCode': 'go', 'page': '', 'siteId': 'go', 'lid': 13, 'isLogin': 'Y', 'retut': 1,
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'themeId': 'business', 'tlang': 'en_US',
					'presaveId': presave, 'goteam_draft_only': 1, 'isWide': 1, 'nextUrl': '/pages/html/list.html',
				},
				allowScriptAccess: 'always',
			};
			sessions.set({ movieId: presave }, req);
			break;
		}

		case '/player': {
			title = 'Video Player';
			attrs = {
				data: process.env.SWF_URL + '/player.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'ut': 60,
					'autostart': 1, 'isWide': 1, 'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
				},
				allowScriptAccess: 'always',
			};
			break;
		}

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
<<<<<<< HEAD
	res.end(`<script>document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}</script><body style="margin:0px">${toObjectString(attrs, params)
=======
	res.end(
		<head>
		<script>
			document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}
		</script>
		<script>
			if(window.location.pathname == '/player') {
				function hideHeader() {
					document.getElementById("header").style.display = "none";
				}
			} else if(window.location.pathname == '/go_full') {
				function hideHeader() {
					document.getElementById("header").style.display = "none";
				}
			}
		</script>
		<link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic" rel="stylesheet" type="text/css">
                <link href="/html/themelist/themelistfiles/common_combined.css.gz.css" rel="stylesheet" type="text/css">
                <link href="/html/themelist/themelistfiles/importer.css.gz.css" rel="stylesheet" type="text/css">
		<style>
			body {
				background: #eee;
			}
		</style>
	</head>
	
	<div class="site-header">
    <div class="navbar site-nav" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                <a class="navbar-brand" href="/" title="GoAnimate">
                    <img alt="Make a Video Online with GoAnimate.com" src="/html/logo4s.png">
                </a>
            </div>
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                
                <ul class="nav navbar-nav navbar-right">
<li class="dropdown">
                    <a class="dropdown-toggle" href="/go_full" data-toggle="dropdown">Your Account <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="list.html">Dashboard</a></li>
                        <li><a href="list.html">Your Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="http://web.archive.org/web/20170101014613/http:/goanimate.com/account">Account Settings</a></li>
                        <li><a href="http://web.archive.org/web/20170101014613/http:/goanimate.com/profile/00lbzOKBnEro">Your Profile</a></li>
                        <li class="divider"></li>
                        <li><a class="logout-link" href="https://ga.vyond.com/logoff">Logout</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                        <a class="dropdown-toggle" href="http://web.archive.org/web/20170101014613/https://goanimate.com/videos" data-toggle="dropdown">Explore <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="http://web.archive.org/web/20170101014613/http://resources.goanimate.com/">Resources</a></li>
                            <li><a href="http://web.archive.org/web/20170101014613/http://blog.goanimate.com/">Blog</a></li>
                            <li><a href="http://web.archive.org/web/20170101014613/https://goanimate.com/videos">Featured Videos</a></li>
                            <li><a href="http://web.archive.org/web/20170101014613/http://blog.goanimate.com/topic/case-studies">Case Studies</a></li>
                            <li><a href="http://web.archive.org/web/20170101014613/https://support.goanimate.com/">Help Center</a></li>
                        </ul>
                    </li>
                <li>
			<li class="plans-and-pricing">
                        <a href="https://www.vyond.com/plans">Plans &amp; Pricing</a>
                    </li>
                    <li>
                    <a class="hidden-sm hidden-md hidden-lg" href="/go_full">Make a Video</a>
                    <span class="site-nav-btn hidden-xs"><a class="btn btn-green" href="/go_full">Make a Video</a>
</span>
                </li>
            </ul>
        </div>
    </div>
	
	<body style="margin:0px" onload="hideHeader()">${toObjectString(attrs, params)
>>>>>>> 9257d11b3ff6f9c0f77ed0b38a1a11fb472abf4f
		}</body>${stuff.pages[url.pathname] || ''}`);
	return true;
}
