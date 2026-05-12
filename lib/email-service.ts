import { Resend } from 'resend';
import { AuditReport } from './audit-engine/types';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

/**
 * Sends a transactional email to the lead confirming their audit results.
 * If savings are > $500, highlights the Credex consultation offer.
 */
export async function sendAuditConfirmationEmail(
  email: string, 
  report: AuditReport,
  auditId: string,
  company?: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key missing. Mocking email send to:', email);
    return;
  }

  const isHighSavings = report.totalMonthlyDelta >= 500;
  const annualSavings = (report.totalMonthlyDelta * 12).toLocaleString();

  try {
    await resend.emails.send({
      from: 'Credex Audits <onboarding@resend.dev>',
      to: email,
      subject: `Your AI Audit Report: $${annualSavings}/year identified`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Credex Audit Intelligence</h1>
          <p>Hello,</p>
          <p>We've successfully processed your organization's AI audit${company ? ` for ${company}` : ''}.</p>
          
          <div style="background: #f4f4f5; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold;">Potential Annual Recovery</p>
            <p style="margin: 5px 0 0; font-size: 32px; font-weight: bold; color: #10b981;">$${annualSavings}</p>
          </div>

          <p>Our engine identified <strong>${report.recommendations.length} tactical actions</strong> to optimize your stack.</p>
          
          ${isHighSavings ? `
            <div style="border-left: 4px solid #3b82f6; padding-left: 20px; margin: 30px 0;">
              <p style="font-weight: bold; color: #3b82f6;">Strategic Opportunity Detected</p>
              <p>Because your identified savings exceed $500/mo, a Credex strategist is available for a deep-dive consultation to help you capture this ROI immediately.</p>
              <a href="https://credex.ai/book" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Book Consultation</a>
            </div>
          ` : ''}

          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            Engine Version: ${report.engineVersion}<br />
            Report ID: ${auditId}
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}
