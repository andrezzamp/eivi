import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mysql from './utils/mysql';
import email from './utils/email';

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(path.resolve(), 'public')));

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use(session({
	secret: '321eivi-secret123',
	cookie: {
		maxAge: 60000,
	},
	resave: false,
	saveUninitialized: true
}));

app.use(cookieParser());

app.use(function (req, res, next) {
	res.locals.newsletterMessage = null;

	if (req.session.newsletterMessage) {
		res.locals.newsletterMessage = req.session.newsletterMessage;
		req.session.newsletterMessage = null;
	}

	next();
});

app.get('/', (req, res) => {
	res.render('home', { title: 'Home' });
});

app.get('/about-us', (req, res) => {
	res.render('aboutus.ejs', { title: 'About us' });
});

app.get('/how-it-works', (req, res) => {
	res.render('howitworks.ejs', { title: 'About us' });
});

app.get('/our-packages', (req, res) => {
	res.render('ourpackages.ejs', { title: 'About us' });
});

app.get('/book-a-package', (req, res) => {
	res.render('bookapackage.ejs', { title: 'Book a Package' });
});

app.post('/book-a-package', async (req, res) => {
	const result = await mysql.query(`
		INSERT INTO newsletter (name, email, social_media_profiles, website_url, phone_number, brand_description, brand_voice_tone, selected_packages, prefered_topics, brand_colors, key_competitors, reference_images) 
		VALUES ("${req.body.name}", "${req.body.email}", "${req.body.social_media_profiles}, "${req.body.website_url}, "${req.body.phone_number}, "${req.body.brand_description}, "${req.body.brand_voice_tone}, "${req.body.selected_packages}, "${req.body.prefered_topics}, "${req.body.brand_colors}, "${req.body.key_competitors}, "${req.body.reference_images}");
	`);
	req.session.newsletterMessage = 'Your form has been submitted. Thank you!';
	res.redirect('back');
});

app.get('/blog', async (req, res) => {
	const posts = await mysql.query('SELECT * FROM posts');
	res.render('blog.ejs', { title: 'Blog', posts });
});

app.get('/blog/:postId', async (req, res) => {
	const posts = await mysql.query(`SELECT * FROM posts WHERE id = ${req.params.postId}`);
	res.render('post.ejs', { title: `Blog - ${posts[0].title}`, post: posts[0] });
});

app.get('/contact', (req, res) => {
	res.render('contact.ejs', { title: 'Contact' });
});

app.post('/contact', async (req, res) => {
	await email.send(req.body.name, req.body.email, req.body.subject, req.body.message);
	res.render('contact.ejs', { title: 'Contact' });
});

app.get('/newsletter', (req, res) => {
	res.render('newsletter', { title: 'Newsletter' });
});

app.post('/newsletter', async (req, res) => {
	const result = await mysql.query(`INSERT INTO newsletter (name, email) VALUES ("${req.body.name}", "${req.body.email}")`);
	req.session.newsletterMessage = 'Your form has been submitted. Thank you!';
	res.redirect('back');
});

dotenv.config();

app.listen(process.env.PORT);

console.log(`Listening on Port ${process.env.PORT}`);

export default app;
