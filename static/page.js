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
			title = 'Import a character - Character Creator';
			attrs = {
				data: process.env.SWF_URL + '/cc.swf', // data: 'cc.swf',
				type: 'application/x-shockwave-flash', 
				id: 'char_creator', 
				width: '960', 
				height: '600', 
				style:'display:block;margin-left:auto;margin-right:auto;',
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
			title = 'Import/edit video on Legacy Video Maker';
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
			title = 'Video Player - GoAnimate For Schools';
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
				allowFullScreen: 'true',
			};
			break;
		}

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`
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
		<link rel="stylesheet" type="text/css" href="/pages/css/common_combined.css.gz.css">
		<link rel="stylesheet" type="text/css" href="/pages/css/cc.css.gz.css">
		<style>
			body {
				background: #eee;
			}
		</style>
	</head>
	
	<nav class="navbar site-nav" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            <a class="navbar-brand" href="/" title="GoAnimate for Schools">
                <img alt="GoAnimate for Schools" src="/pages/img/logo4s.png">
            </a>
        </div>

        <ul class="nav site-nav-alert-nav hidden-xs">
            <li>
                <a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/messages" title="Messages"><span class="glyphicon glyphicon-envelope"></span><span class="count"></span></a>
            </li>
            <li>
                <a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/notifications" title="Notifications"><span class="glyphicon glyphicon-bell"></span><span class="count"></span></a>
            </li>
        </ul>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">

                <li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Your Account <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/student">Dashboard</a></li>
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/movies">Your Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/account">Account Settings</a></li>
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/profile/0DyHqK6Yj9dM">Your Profile</a></li>
                        <li class="divider"></li>
                        <li><a class="logout-link" href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/logoff">Logout</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/students">Students</a></li>
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/teachers">Teachers</a></li>
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/videos">Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="http://web.archive.org/web/20191027000240/https://blog.goanimate4schools.com/">Educator Experiences</a></li>
                        <li><a href="http://web.archive.org/web/20191027000240/http://vyondhoster.000webhostapp.com/public_faq">FAQ</a></li>
                    </ul>
                </li>
                <li>
                    <a class="hidden-sm hidden-md hidden-lg" href="/pages/html/lvm.html">Make a Video</a>
                    <span class="site-nav-btn hidden-xs"><a class="btn btn-green" href="/pages/html/lvm.html">Make a Video</a></span>
                </li>
            </ul>
        </div>
    </div>
</nav>
	
	<body style="margin:0px" onload="hideHeader()">${toObjectString(attrs, params)
		}</body>${stuff.pages[url.pathname] || ''}`);
	return true;
}
