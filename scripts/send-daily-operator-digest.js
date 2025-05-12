#!/usr/bin/env node
/**
 * SmartText AI Daily Operator Digest
 * 
 * This script fetches daily statistics from the /api/admin/daily-stats endpoint
 * and sends a formatted email digest to the configured operator email address.
 * 
 * Usage:
 *   npm run send-daily-operator-digest
 * 
 * Environment variables:
 *   RESEND_API_KEY - API key for Resend email service
 *   OPERATOR_DAILY_DIGEST_RECIPIENT - Email address to send the digest to
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENT_EMAIL = process.env.OPERATOR_DAILY_DIGEST_RECIPIENT;

// For production, use the custom domain
// For development/testing, use Resend's default sender domain
const SENDER_EMAIL = process.env.NODE_ENV === 'production'
  ? 'no-reply@getsmarttext.com'
  : 'onboarding@resend.dev';

// Validate required environment variables
if (!RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY environment variable is required');
  process.exit(1);
}

if (!RECIPIENT_EMAIL) {
  console.error('Error: OPERATOR_DAILY_DIGEST_RECIPIENT environment variable is required');
  process.exit(1);
}

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

/**
 * Format a number with commas for readability
 */
function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * Format currency for readability
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Get status emoji based on value
 */
function getStatusEmoji(value, threshold = 0) {
  if (value === 0) return '✅';
  if (value <= threshold) return '✅';
  if (value <= threshold * 2) return '⚠️';
  return '❌';
}

/**
 * Format a timestamp to a readable date/time
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Generate plain text email content
 */
function generatePlainTextEmail(data) {
  const { lastUpdated, today, subscriberMetrics } = data;
  
  let text = '';
  
  // Header
  text += 'SMARTTEXT AI DAILY OPERATOR DIGEST\n';
  text += '===================================\n\n';
  
  // Timestamp
  text += `As of ${formatTimestamp(new Date())}\n`;
  text += `Data freshness: ${formatTimestamp(lastUpdated)}\n\n`;
  
  // Today's Stats
  text += 'TODAY\'S ACTIVITY\n';
  text += '-----------------\n';
  text += `Total Calls: ${formatNumber(today.totalCalls)}\n`;
  text += `Missed Calls: ${getStatusEmoji(today.missedCalls, 5)} ${formatNumber(today.missedCalls)}\n`;
  text += `SMS Sent: ${formatNumber(today.smsSent)}\n`;
  text += `SMS Failed: ${getStatusEmoji(today.smsFailed, 3)} ${formatNumber(today.smsFailed)}\n`;
  text += `OpenAI Tokens Used: ${formatNumber(today.openaiTokensUsed)}\n`;
  text += `Owner Alerts Sent: ${getStatusEmoji(today.ownerAlertsSent, 3)} ${formatNumber(today.ownerAlertsSent)}\n\n`;
  
  // Subscriber Metrics
  text += 'SUBSCRIBER METRICS\n';
  text += '------------------\n';
  text += `Total Businesses: ${formatNumber(subscriberMetrics.totalBusinesses)}\n`;
  text += `Active Businesses: ${formatNumber(subscriberMetrics.activeBusinesses)}\n`;
  text += `Inactive Businesses: ${formatNumber(subscriberMetrics.totalBusinesses - subscriberMetrics.activeBusinesses)}\n\n`;
  
  // Plan Breakdown
  text += 'PLAN BREAKDOWN\n';
  text += '--------------\n';
  text += `Free: ${formatNumber(subscriberMetrics.planBreakdown.free)}\n`;
  text += `Pro: ${formatNumber(subscriberMetrics.planBreakdown.pro)}\n`;
  text += `Enterprise: ${formatNumber(subscriberMetrics.planBreakdown.enterprise)}\n\n`;
  
  // MRR
  text += 'REVENUE\n';
  text += '-------\n';
  text += `Total MRR: ${formatCurrency(subscriberMetrics.totalMRR)}\n\n`;
  
  // Footer
  text += 'This is an automated message from SmartText AI.\n';
  text += 'For questions or issues, please contact the development team.\n';
  
  return text;
}

/**
 * Generate HTML email content
 */
function generateHtmlEmail(data) {
  const { lastUpdated, today, subscriberMetrics } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartText AI Daily Operator Digest</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #4F46E5;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      padding: 20px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 5px 5px;
    }
    .timestamp {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
      text-align: right;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .metric-label {
      font-weight: normal;
    }
    .metric-value {
      font-weight: bold;
    }
    .metric-value.positive {
      color: #10B981;
    }
    .metric-value.warning {
      color: #F59E0B;
    }
    .metric-value.negative {
      color: #EF4444;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .plan-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 15px;
    }
    .plan-box {
      background-color: #f9fafb;
      border-radius: 5px;
      padding: 15px;
      text-align: center;
    }
    .plan-count {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .plan-name {
      font-size: 14px;
      color: #666;
    }
    .mrr {
      font-size: 28px;
      font-weight: bold;
      color: #10B981;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SmartText AI Daily Operator Digest</h1>
  </div>
  
  <div class="content">
    <div class="timestamp">
      <div>As of ${formatTimestamp(new Date())}</div>
      <div>Data freshness: ${formatTimestamp(lastUpdated)}</div>
    </div>
    
    <div class="section">
      <div class="section-title">Today's Activity</div>
      
      <div class="metric-row">
        <span class="metric-label">Total Calls</span>
        <span class="metric-value">${formatNumber(today.totalCalls)}</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-label">Missed Calls</span>
        <span class="metric-value ${today.missedCalls > 5 ? 'negative' : 'positive'}">
          ${getStatusEmoji(today.missedCalls, 5)} ${formatNumber(today.missedCalls)}
        </span>
      </div>
      
      <div class="metric-row">
        <span class="metric-label">SMS Sent</span>
        <span class="metric-value">${formatNumber(today.smsSent)}</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-label">SMS Failed</span>
        <span class="metric-value ${today.smsFailed > 3 ? 'negative' : 'positive'}">
          ${getStatusEmoji(today.smsFailed, 3)} ${formatNumber(today.smsFailed)}
        </span>
      </div>
      
      <div class="metric-row">
        <span class="metric-label">OpenAI Tokens Used</span>
        <span class="metric-value">${formatNumber(today.openaiTokensUsed)}</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-label">Owner Alerts Sent</span>
        <span class="metric-value ${today.ownerAlertsSent > 3 ? 'warning' : 'positive'}">
          ${getStatusEmoji(today.ownerAlertsSent, 3)} ${formatNumber(today.ownerAlertsSent)}
        </span>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Subscriber Metrics</div>
      
      <div class="metric-row">
        <span class="metric-label">Total Businesses</span>
        <span class="metric-value">${formatNumber(subscriberMetrics.totalBusinesses)}</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-label">Active Businesses</span>
        <span class="metric-value positive">${formatNumber(subscriberMetrics.activeBusinesses)}</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-label">Inactive Businesses</span>
        <span class="metric-value">${formatNumber(subscriberMetrics.totalBusinesses - subscriberMetrics.activeBusinesses)}</span>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Plan Breakdown</div>
      
      <div class="plan-grid">
        <div class="plan-box">
          <div class="plan-count">${formatNumber(subscriberMetrics.planBreakdown.free)}</div>
          <div class="plan-name">Free</div>
        </div>
        
        <div class="plan-box">
          <div class="plan-count">${formatNumber(subscriberMetrics.planBreakdown.pro)}</div>
          <div class="plan-name">Pro</div>
        </div>
        
        <div class="plan-box">
          <div class="plan-count">${formatNumber(subscriberMetrics.planBreakdown.enterprise)}</div>
          <div class="plan-name">Enterprise</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Revenue</div>
      <div class="mrr">${formatCurrency(subscriberMetrics.totalMRR)}</div>
    </div>
    
    <div class="footer">
      <p>This is an automated message from SmartText AI.</p>
      <p>For questions or issues, please contact the development team.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Fetch daily stats from the API
 */
async function fetchDailyStats() {
  try {
    const endpoint = `${API_BASE_URL}/api/admin/daily-stats`;
    console.log(`Fetching data from: ${endpoint}`);
    
    // For production, uncomment this code to fetch from the actual API
    /*
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`API returned error: ${data.error}`);
    }
    
    return data;
    */
    
    // For testing, use mock data
    console.log('Using mock data for testing');
    
    // Get today's date
    const today = new Date();
    
    // Return mock data similar to what's in the monitoring.tsx file
    return {
      success: true,
      lastUpdated: new Date().toISOString(),
      allTime: {
        totalCalls: 1248,
        missedCalls: 187,
        smsSent: 3542,
        smsFailed: 76,
        openaiTokensUsed: 8745920,
        ownerAlertsSent: 53,
      },
      today: {
        totalCalls: 42,
        missedCalls: 7,
        smsSent: 128,
        smsFailed: 3,
        openaiTokensUsed: 345600,
        ownerAlertsSent: 2,
      },
      subscriberMetrics: {
        totalBusinesses: 156,
        activeBusinesses: 142,
        planBreakdown: {
          free: 45,
          pro: 98,
          enterprise: 13
        },
        totalMRR: 24850
      }
    };
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    throw error;
  }
}

/**
 * Send email digest
 */
async function sendEmailDigest(data) {
  try {
    const plainText = generatePlainTextEmail(data);
    const html = generateHtmlEmail(data);
    
    // For testing with Resend, we need to use their test email address
    // In production, this would be the actual recipient email
    const toEmail = RECIPIENT_EMAIL.includes('example.com') 
      ? 'delivered@resend.dev' // Resend's test email address
      : RECIPIENT_EMAIL;
    
    console.log(`Sending email digest to: ${toEmail}`);
    console.log(`(Note: Using Resend test email address for development)`);
    
    const { data: emailData, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      subject: `SmartText AI Daily Digest - ${new Date().toLocaleDateString()}`,
      text: plainText,
      html: html,
    });
    
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    console.log(`Email sent successfully! ID: ${emailData.id}`);
    console.log(`In production, this would be sent to: ${RECIPIENT_EMAIL}`);
    return emailData;
  } catch (error) {
    console.error('Error sending email digest:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting SmartText AI Daily Operator Digest...');
    
    // Fetch daily stats
    const data = await fetchDailyStats();
    console.log('Daily stats fetched successfully');
    
    // Send email digest
    await sendEmailDigest(data);
    
    console.log('Daily operator digest completed successfully');
  } catch (error) {
    console.error('Error in daily operator digest:', error);
    process.exit(1);
  }
}

// Run the script
main();
