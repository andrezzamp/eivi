import * as dotenv from 'dotenv';
import nodeMailer from 'nodemailer';

dotenv.config();

export default {
    async send(name, email, subject, message) {
        const transporter = await nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const options = {
            from: process.env.GMAIL_USER,
            to: process.env.CONTACT_EMAIL,
            subject: 'Eivi Contact Form',
            text: `You got a message from
                   Subject: ${subject} 
                   Email: ${email}
                   Name: ${name}
                   Message: ${message}`,
        };

        try {
            await transporter.sendMail(options);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
