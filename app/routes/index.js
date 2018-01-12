'use strict';


const bodyParser = require('body-parser');
const path = process.cwd();
const PollsHandler = require(path + '/app/controllers/pollsHandler.server.js');

module.exports = (app, passport) => {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.session.redirectTo = req.path;
			res.redirect('/login');
		}
	}

	const pollsHandler = new PollsHandler();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	
	app.route('/')
		.get((req, res) => {
			if (req.session.redirectTo) {
				const path = req.session.redirectTo;
				delete req.session.redirectTo;
				res.redirect(path);
			}
			else res.redirect('/polls');
		});
	app.route('/polls')
		.get((req, res) => {
			res.sendFile(path + '/public/polls.html');
		});

	app.route('/login')
		.get((req, res) => {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/profile.html');
		});
		
	app.route('/addPoll')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/addPoll.html');
		});
		
	app.route('/addPoll/:id/:name')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/successAdded.html');
		});

	app.route('/polls/:id')
		.get((req, res) => {
			res.sendFile(path + '/public/showPoll.html');
		});
		
	app.route('/my_polls')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/polls.html');
		});	

	app.route('/api/user')
		.get((req, res) => {
			if (!req.user) return res.json({});
			res.json(req.user);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/polls')
		.get(pollsHandler.getPolls)
		.post(pollsHandler.addPoll);
	
	app.route('/api/:id/voteFor/:name')
		.put(pollsHandler.voteFor);
		
	app.route('/api/:id/addOption/:name')
		.put(pollsHandler.addOption);
		
	app.route('/api/:id/deletePoll')
		.delete(pollsHandler.deletePoll);
		
};
