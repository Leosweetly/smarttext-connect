// This service will handle sending notifications via email and SMS
// In a real implementation, this would make actual API calls to the backend

interface NotificationOptions {
  to: string;
  subject?: string;
  message: string;
  businessName?: string;
}

// Mock function to send an email
export const sendEmail = async (options: NotificationOptions): Promise<{ success: boolean }> => {
  try {
    // In a real implementation, this would be an API call to the backend
    console.log('Sending email:', options);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
    };
  }
};

// Mock function to send an SMS
export const sendSMS = async (options: NotificationOptions): Promise<{ success: boolean }> => {
  try {
    // In a real implementation, this would be an API call to the backend
    console.log('Sending SMS:', options);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
    };
  }
};

// Function to send a welcome email
export const sendWelcomeEmail = async (email: string, businessName: string): Promise<{ success: boolean }> => {
  const subject = `Welcome to SmartText AI, ${businessName}!`;
  const message = `
    <h1>Welcome to SmartText AI!</h1>
    <p>Thank you for signing up, ${businessName}. We're excited to help you automate your customer communications.</p>
    <p>Here are some things you can do to get started:</p>
    <ul>
      <li>Complete your business profile</li>
      <li>Set up your business hours</li>
      <li>Customize your message templates</li>
      <li>Connect your phone number</li>
    </ul>
    <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
    <p>Best regards,<br>The SmartText AI Team</p>
  `;
  
  return sendEmail({
    to: email,
    subject,
    message,
    businessName,
  });
};

// Function to send a welcome SMS
export const sendWelcomeSMS = async (phone: string, businessName: string): Promise<{ success: boolean }> => {
  const message = `Welcome to SmartText AI, ${businessName}! Your account is now set up and ready to use. Reply HELP for assistance or visit your dashboard to get started.`;
  
  return sendSMS({
    to: phone,
    message,
    businessName,
  });
};

// Function to send an onboarding completion confirmation
export const sendOnboardingCompletionEmail = async (email: string, businessName: string): Promise<{ success: boolean }> => {
  const subject = `Onboarding Complete - ${businessName}`;
  const message = `
    <h1>Onboarding Complete!</h1>
    <p>Congratulations, ${businessName}! You've completed the onboarding process for SmartText AI.</p>
    <p>Your account is now fully set up and ready to use. You can now:</p>
    <ul>
      <li>Start receiving and responding to customer messages</li>
      <li>Manage missed calls and follow-ups</li>
      <li>Track customer conversations</li>
      <li>Customize your settings and templates</li>
    </ul>
    <p>Thank you for choosing SmartText AI for your customer communication needs.</p>
    <p>Best regards,<br>The SmartText AI Team</p>
  `;
  
  return sendEmail({
    to: email,
    subject,
    message,
    businessName,
  });
};

// Function to send a subscription cancellation confirmation
export const sendCancellationConfirmationEmail = async (email: string, businessName: string): Promise<{ success: boolean }> => {
  const subject = `Subscription Canceled - ${businessName}`;
  const message = `
    <h1>Subscription Canceled</h1>
    <p>Hello ${businessName},</p>
    <p>We're sorry to see you go. Your subscription to SmartText AI has been canceled as requested.</p>
    <p>If you change your mind, you can reactivate your subscription at any time from your account settings.</p>
    <p>We'd love to hear your feedback on why you decided to cancel. Your insights will help us improve our service.</p>
    <p>Thank you for giving SmartText AI a try.</p>
    <p>Best regards,<br>The SmartText AI Team</p>
  `;
  
  return sendEmail({
    to: email,
    subject,
    message,
    businessName,
  });
};

// Function to send a cancellation feedback request
export const sendCancellationFeedbackRequestEmail = async (email: string, businessName: string, feedbackUrl?: string): Promise<{ success: boolean }> => {
  const subject = `We'd Love Your Feedback - ${businessName}`;
  const message = `
    <h1>We'd Love Your Feedback</h1>
    <p>Hello ${businessName},</p>
    <p>We noticed you recently canceled your SmartText AI subscription. We're always looking to improve our service, and your feedback would be incredibly valuable to us.</p>
    <p>Could you take a moment to let us know why you decided to cancel? Your insights will help us make SmartText AI better for everyone.</p>
    ${feedbackUrl ? `<p><a href="${feedbackUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Share Your Feedback</a></p>` : ''}
    <p>Thank you for your time and for giving SmartText AI a try.</p>
    <p>Best regards,<br>The SmartText AI Team</p>
  `;
  
  return sendEmail({
    to: email,
    subject,
    message,
    businessName,
  });
};

// Function to send a cancellation feedback request via SMS
export const sendCancellationFeedbackRequestSMS = async (phone: string, businessName: string, feedbackUrl?: string): Promise<{ success: boolean }> => {
  const message = `Hi ${businessName}, we noticed you canceled your SmartText AI subscription. We'd love to hear why so we can improve. ${feedbackUrl ? `Share your thoughts: ${feedbackUrl}` : 'Reply to this message with your feedback.'}`;
  
  return sendSMS({
    to: phone,
    message,
    businessName,
  });
};
