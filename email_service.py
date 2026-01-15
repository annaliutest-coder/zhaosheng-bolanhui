import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email configuration from environment variables
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USERNAME)
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "ABC系招生組")

# Application URLs
APPLY_URL = "https://www.example-university.edu/abc/apply"
DEPT_WEBSITE = "https://www.example-university.edu/abc"
CONTACT_EMAIL = "abc-admission@example-university.edu"


def generate_email_html(student_name: str, welcome_letter: str) -> str:
    """Generate HTML email template with welcome letter."""
    return f"""
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>歡迎參加 ABC 系招生博覽會</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Microsoft JhengHei', '微軟正黑體', Arial, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                🎓 ABC Department
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                                Example University
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px;">
                                親愛的 {student_name}，您好！
                            </h2>
                            
                            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                                <p style="margin: 0; color: #334155; font-size: 16px; line-height: 1.8;">
                                    {welcome_letter.replace('\n', '<br>')}
                                </p>
                            </div>
                            
                            <!-- Action Buttons -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{APPLY_URL}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 10px;">
                                            📝 立即申請
                                        </a>
                                        <a href="{DEPT_WEBSITE}" style="display: inline-block; background-color: #64748b; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 10px;">
                                            🔍 了解更多
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Important Info -->
                            <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
                                <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 18px;">
                                    📌 重要資訊
                                </h3>
                                <table width="100%" cellpadding="8" cellspacing="0">
                                    <tr>
                                        <td style="color: #78350f; font-size: 14px; font-weight: bold; width: 120px;">
                                            🌐 申請網站：
                                        </td>
                                        <td style="color: #78350f; font-size: 14px;">
                                            <a href="{APPLY_URL}" style="color: #2563eb; text-decoration: none;">
                                                {APPLY_URL}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #78350f; font-size: 14px; font-weight: bold;">
                                            🏛️ 系所網站：
                                        </td>
                                        <td style="color: #78350f; font-size: 14px;">
                                            <a href="{DEPT_WEBSITE}" style="color: #2563eb; text-decoration: none;">
                                                {DEPT_WEBSITE}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #78350f; font-size: 14px; font-weight: bold;">
                                            📧 聯絡信箱：
                                        </td>
                                        <td style="color: #78350f; font-size: 14px;">
                                            <a href="mailto:{CONTACT_EMAIL}" style="color: #2563eb; text-decoration: none;">
                                                {CONTACT_EMAIL}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                                © 2026 ABC Department, Example University
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                此郵件由招生博覽會簽到系統自動發送
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""


async def send_welcome_email(
    recipient_email: str,
    student_name: str,
    welcome_letter: str
) -> bool:
    """
    Send welcome email to student asynchronously.
    
    Args:
        recipient_email: Student's email address
        student_name: Student's name
        welcome_letter: AI-generated personalized welcome letter
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    # Check if SMTP is configured
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        logger.warning("SMTP not configured. Email will not be sent.")
        logger.info(f"Would have sent email to: {recipient_email}")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'歡迎參加 ABC 系招生博覽會 - {student_name}'
        msg['From'] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        msg['To'] = recipient_email
        
        # Generate HTML content
        html_content = generate_email_html(student_name, welcome_letter)
        
        # Attach HTML part
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Send email via SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {recipient_email}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP authentication failed. Check your credentials.")
        return False
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error occurred: {e}")
        return False
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


def send_welcome_email_sync(
    recipient_email: str,
    student_name: str,
    welcome_letter: str
) -> bool:
    """
    Synchronous version of send_welcome_email for use in FastAPI BackgroundTasks.
    """
    import asyncio
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            send_welcome_email(recipient_email, student_name, welcome_letter)
        )
        loop.close()
        return result
    except Exception as e:
        logger.error(f"Error in sync email send: {e}")
        return False
