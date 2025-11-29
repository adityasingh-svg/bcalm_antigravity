// Twilio SMS Service for Hackathon OTP
// Uses environment variables for Twilio credentials

import twilio from 'twilio';

function getCredentials() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !apiKey || !apiKeySecret) {
    throw new Error('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_API_KEY, and TWILIO_API_KEY_SECRET environment variables.');
  }

  return {
    accountSid,
    apiKey,
    apiKeySecret,
    phoneNumber
  };
}

export function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = getCredentials();
  return twilio(apiKey, apiKeySecret, { accountSid });
}

export function getTwilioFromPhoneNumber() {
  const { phoneNumber } = getCredentials();
  return phoneNumber;
}

export async function sendOtpSms(toPhoneNumber: string, otp: string): Promise<boolean> {
  try {
    const credentials = getCredentials();
    
    if (!credentials.accountSid?.startsWith('AC')) {
      console.warn('Twilio Account SID must start with "AC". Current value appears incorrect.');
      return false;
    }
    
    if (!credentials.apiKey?.startsWith('SK')) {
      console.warn('Twilio API Key must start with "SK". Current value appears incorrect.');
      return false;
    }
    
    const client = getTwilioClient();
    const fromNumber = getTwilioFromPhoneNumber();
    
    if (!fromNumber) {
      console.error('No Twilio phone number configured');
      return false;
    }
    
    const formattedPhone = toPhoneNumber.startsWith('+91') 
      ? toPhoneNumber 
      : `+91${toPhoneNumber}`;
    
    await client.messages.create({
      body: `Your Bcalm Hackathon verification code is: ${otp}. Valid for 10 minutes.`,
      from: fromNumber,
      to: formattedPhone
    });
    
    console.log(`SMS sent successfully to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

export function isTwilioConfigured(): boolean {
  try {
    getCredentials();
    return true;
  } catch {
    return false;
  }
}
