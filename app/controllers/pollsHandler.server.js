'use strict';

const Polls = require('../models/polls.js');

function PollsHandler () {

	this.getPolls = (req, res) => {
		Polls.find({}, (err, results) => {
			if (err) return res.sendStatus(500);
			const passport = req.session.passport;
			const userId = passport ? passport.user ? passport.user 
													: "" 
									: "";
			res.set({
				userId
			});
			res.json(results);
		});
	};
	
	this.addPoll = (req, res) => {
		let name = req.body.pollName;
		name = name[0].toUpperCase() + name.slice(1);
		if (name[name.length - 1] != "?") name += "?";
		let options = [];
		let i = 1;
		while(req.body["option" + i]) {
			let option = req.body["option" + i];
			option = option[0].toUpperCase() + option.slice(1);
			options.push({
				name: option,
				votes: 0
			});
			i++;
		}
		const user_id = req.body.user_id;
		Polls.findOne({name: name}, (err, result) => {
			if (err) return res.sendStatus(500);
			if (result)	return res.redirect('/polls');
			Polls.create({
				user_id,
				name,
				options
				}, 
				(err, result) => {
					if (err) return res.sendStatus(500);
					res.redirect(`/addPoll/${result._id}/${name}`);
				});
		});
	};

	this.voteFor = (req, res) => {
		const pollsId = req.params.id;
		const chosenName = req.params.name;
		Polls.findById(pollsId,  (err, todo) => {
			if (err) return res.sendStatus(500);
			
			let hasVoted;
			if (req.user) {
				hasVoted = !!(todo.voters.filter(val => val.id == req.user._id).length);
			}
			else {
				if (!req.session.votedPolls) req.session.votedPolls = [];
				hasVoted = !!(req.session.votedPolls.filter(val => val == pollsId).length);
			}
			
			if (hasVoted) {
				return res.sendStatus(403);
			}
			todo.options = todo.options.map(val => {
				if (val.name == chosenName) {
					return {
						name: val.name,
						votes: val.votes + 1
					};
				}
				else {
					return {
						name: val.name,
						votes: val.votes
					};
				}
			});
			if (req.user) {
				todo.voters.push({
					id: req.user._id
				});
			}
			else req.session.votedPolls.push(pollsId);
			
			todo.save((err, todo) => {
				if (err) return res.sendStatus(500);
				res.sendStatus(201);
			});
		});
	};
	
	this.addOption = (req, res) => {
		const id = req.params.id;
		let name = req.params.name;
		name = name[0].toUpperCase() + name.slice(1);
		Polls.findById(id, (err, todo) => {
			if (err) return res.sendStatus(500);
			if (todo.adders.filter(val => val.id == req.user._id).length) return res.sendStatus(403);
			todo.options.push({
				name,
				votes: 0
			});
			todo.adders.push({
				id: req.user._id
			});
			todo.save((err, todo) => {
				if (err) return res.sendStatus(500);
				res.sendStatus(201);
			});
		});
		
	};
	
	this.deletePoll = (req, res) => {
		const id = req.params.id;
		Polls.findByIdAndRemove(id, (err, todo) => {
			if (err) return res.sendStatus(500);
			res.sendStatus(200);
		});
	};
}

module.exports = PollsHandler;
