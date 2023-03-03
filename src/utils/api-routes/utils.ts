import sendgrid from '@sendgrid/mail';
import { errors } from '../errors';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

type EmailOptions = {
  to: string;
  from: string;
  subject: string;
  html: string;
};

export async function sendEmail(options: EmailOptions) {
  try {
    return sendgrid.send(options);
  } catch (error) {
    errors.add(error);
  }
}
