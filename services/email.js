const SibApiV3Sdk = require("sib-api-v3-sdk");

// Ensure you have set your API key in the .env file
const apiKey = process.env.SENDINBLUE_API_KEY; 

// Initialize Sendinblue API client and set API key directly
const client = SibApiV3Sdk.ApiClient.instance;
const apiKeyInstance = client.authentications['api-key'];
apiKeyInstance.apiKey = apiKey;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Function to send emails
const sendEmail = async (to, subject, htmlContent) => {
  const sender = { email: 'abufaizan1997@gmail.com', name: 'Abu Faizan' };  // Change it to your email
  const recipients = [{ email: to }];

  const email = new SibApiV3Sdk.SendSmtpEmail({
    sender,
    to: recipients,
    subject: subject,
    htmlContent: htmlContent,
  });

  try {
    const response = await apiInstance.sendTransacEmail(email);
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
