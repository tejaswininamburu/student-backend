const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send rejection email
const sendRejectionEmail = async (studentEmail, studentName, documentType, adminComment) => {
  try {
    await transporter.sendMail({
      from: `"EduProfile System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Document Verification Failed — ${documentType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          
          <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EduProfile</h1>
            <p style="color: #94a3b8; margin: 8px 0 0;">Student Achievement System</p>
          </div>

          <div style="background: white; padding: 24px; border-radius: 10px; border-left: 4px solid #ef4444;">
            <h2 style="color: #ef4444; margin: 0 0 16px;">❌ Document Rejected</h2>
            <p style="color: #334155; font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
            <p style="color: #334155;">Your document <strong>${documentType}</strong> has been reviewed and rejected by the administrator.</p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #dc2626; margin: 0; font-weight: 600;">Reason:</p>
              <p style="color: #334155; margin: 8px 0 0;">${adminComment || "Document does not meet the required standards."}</p>
            </div>

            <p style="color: #334155;">Please reupload a clear and valid copy of your <strong>${documentType}</strong>.</p>
            
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #0369a1; margin: 0; font-weight: 600;">📋 Requirements:</p>
              <ul style="color: #334155; margin: 8px 0 0; padding-left: 20px;">
                <li>File must be clear and readable</li>
                <li>Accepted formats: PDF, JPG, PNG</li>
                <li>Maximum file size: 5MB</li>
                <li>All details must be clearly visible</li>
              </ul>
            </div>

            <a href="http://localhost:5173/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;">
              Login to Reupload →
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            This is an automated email from EduProfile System. Please do not reply.
          </p>
        </div>
      `,
    });
    console.log(`✅ Rejection email sent to ${studentEmail}`);
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
  }
};

// Send verification success email
const sendVerificationEmail = async (studentEmail, studentName, documentType) => {
  try {
    await transporter.sendMail({
      from: `"EduProfile System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Document Verified Successfully — ${documentType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          
          <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EduProfile</h1>
            <p style="color: #94a3b8; margin: 8px 0 0;">Student Achievement System</p>
          </div>

          <div style="background: white; padding: 24px; border-radius: 10px; border-left: 4px solid #10b981;">
            <h2 style="color: #10b981; margin: 0 0 16px;">✅ Document Verified</h2>
            <p style="color: #334155; font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
            <p style="color: #334155;">Your document <strong>${documentType}</strong> has been successfully verified by the administrator.</p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #15803d; margin: 0;">🎉 Your document is now part of your verified digital portfolio!</p>
            </div>

            <a href="http://localhost:5173/login" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;">
              View My Profile →
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            This is an automated email from EduProfile System. Please do not reply.
          </p>
        </div>
      `,
    });
    console.log(`✅ Verification email sent to ${studentEmail}`);
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
  }
};
// Send achievement rejection email
const sendAchievementRejectionEmail = async (studentEmail, studentName, achievementTitle, adminComment) => {
  try {
    await transporter.sendMail({
      from: `"EduProfile System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Achievement Verification Failed — ${achievementTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EduProfile</h1>
            <p style="color: #94a3b8; margin: 8px 0 0;">Student Achievement System</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border-left: 4px solid #ef4444;">
            <h2 style="color: #ef4444; margin: 0 0 16px;">❌ Achievement Rejected</h2>
            <p style="color: #334155; font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
            <p style="color: #334155;">Your achievement <strong>${achievementTitle}</strong> has been reviewed and rejected.</p>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #dc2626; margin: 0; font-weight: 600;">Reason:</p>
              <p style="color: #334155; margin: 8px 0 0;">${adminComment || "Achievement does not meet the required standards."}</p>
            </div>
            <p style="color: #334155;">Please resubmit with correct details and valid certificate.</p>
            <a href="http://localhost:5173/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;">
              Login to Resubmit →
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            This is an automated email from EduProfile System.
          </p>
        </div>
      `,
    });
    console.log(`✅ Achievement rejection email sent to ${studentEmail}`);
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
  }
};

// Send achievement verification email
const sendAchievementVerificationEmail = async (studentEmail, studentName, achievementTitle) => {
  try {
    await transporter.sendMail({
      from: `"EduProfile System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Achievement Verified — ${achievementTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EduProfile</h1>
            <p style="color: #94a3b8; margin: 8px 0 0;">Student Achievement System</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border-left: 4px solid #10b981;">
            <h2 style="color: #10b981; margin: 0 0 16px;">✅ Achievement Verified!</h2>
            <p style="color: #334155; font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
            <p style="color: #334155;">Your achievement <strong>${achievementTitle}</strong> has been verified!</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #15803d; margin: 0;">🎉 It is now part of your verified digital portfolio!</p>
            </div>
            <a href="http://localhost:5173/login" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;">
              View My Profile →
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            This is an automated email from EduProfile System.
          </p>
        </div>
      `,
    });
    console.log(`✅ Achievement verification email sent to ${studentEmail}`);
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
  }
};
// Send password reset email
const sendPasswordResetEmail = async (studentEmail, studentName, resetUrl) => {
  try {
    await transporter.sendMail({
      from: `"EduProfile System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: "Password Reset Request — EduProfile",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EduProfile</h1>
            <p style="color: #94a3b8; margin: 8px 0 0;">Student Achievement System</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border-left: 4px solid #3b82f6;">
            <h2 style="color: #1e3a5f; margin: 0 0 16px;">🔐 Password Reset Request</h2>
            <p style="color: #334155; font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
            <p style="color: #334155;">We received a request to reset your password. Click the button below to reset it.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Reset My Password
              </a>
            </div>
            <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #854d0e; margin: 0; font-size: 13px;">⚠️ This link expires in <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>
            </div>
            <p style="color: #64748b; font-size: 13px;">Or copy this link: <br/><span style="color: #3b82f6; word-break: break-all;">${resetUrl}</span></p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            This is an automated email from EduProfile System. Please do not reply.
          </p>
        </div>
      `,
    });
    console.log(`✅ Password reset email sent to ${studentEmail}`);
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
  }
};
module.exports = {
  sendRejectionEmail,
  sendVerificationEmail,
  sendAchievementRejectionEmail,
  sendAchievementVerificationEmail,
  sendPasswordResetEmail,
};