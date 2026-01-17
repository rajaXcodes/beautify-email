import markdownToHtml from "./template.js";
import sendEmail from './mailer.js';
import express from 'express';
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ message: "listening ..." });
});

async function sendMarkdownEmail(recipients, markdownTemplate) {
  try {
    const html = markdownToHtml(markdownTemplate);
    const to = Array.isArray(recipients) ? recipients : [recipients];
    await sendEmail({
      to,
      subject: 'SOC Report & Findings',
      html
    });
    console.log('Emails sent successfully!');
  } catch (err) {
    console.error('Error sending emails:', err);
    throw err;
  }
}

app.post('/sendMail', async (req, res) => {
  try {
    const { template, recipient } = req.body;

    if (!recipient || !template) {
      return res.status(400).json({ message: "Missing recipient or template" });
    }

    await sendMarkdownEmail(recipient, template);

    return res.status(200).json({ message: "Mail sent successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error sending email" });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
