import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';

// Interface cho dữ liệu form
interface OwnerFormData {
  name: string;
  email: string;
  phone: string;
  fieldName: string;
  location: string;
  sport: string;
  description: string;
}

// Cấu hình email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Hoặc dịch vụ email khác
    auth: {
      user: process.env.EMAIL_USER, // Email của bạn
      pass: process.env.EMAIL_PASS, // App password của Gmail
    },
  });
};

// Template HTML cho email
const createEmailTemplate = (data: OwnerFormData) => {
  const sportLabels: { [key: string]: string } = {
    football: 'Bóng đá',
    badminton: 'Cầu lông',
    pickle: 'Pickle Ball',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đăng ký đối tác mới</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .logo {
          max-width: 150px;
          height: auto;
          margin: 0 auto 15px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-section h2 {
          color: #10b981;
          border-bottom: 2px solid #10b981;
          padding-bottom: 8px;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .info-row {
          display: flex;
          margin-bottom: 12px;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .info-label {
          font-weight: bold;
          color: #374151;
          min-width: 150px;
          display: flex;
          align-items: center;
        }
        .info-value {
          color: #1f2937;
          flex: 1;
          padding-left: 10px;
        }
        .description-box {
          background-color: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 15px;
          border-radius: 0 8px 8px 0;
          margin-top: 10px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .urgent-badge {
          display: inline-block;
          background-color: #ef4444;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-left: 10px;
          vertical-align: middle;
        }
        .sport-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 8px;
          vertical-align: middle;
        }
        .section-icon {
          margin-right: 10px;
          vertical-align: middle;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="cid:sportHubLogo" alt="SportHub Logo" class="logo" />
          <h1>ĐĂNG KÝ ĐỐI TÁC MỚI</h1>
          <span class="urgent-badge">CẦN XỬ LÝ</span>
        </div>
        
        <div class="content">
          <div class="info-section">
            <h2><span class="section-icon">👤</span> Thông tin chủ sân</h2>
            <div class="info-row">
              <div class="info-label">Họ và tên:</div>
              <div class="info-value">${data.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${data.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Số điện thoại:</div>
              <div class="info-value">${data.phone}</div>
            </div>
          </div>

          <div class="info-section">
            <h2><span class="section-icon">🏟️</span> Thông tin sân thể thao</h2>
            <div class="info-row">
              <div class="info-label">Tên sân:</div>
              <div class="info-value">${data.fieldName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Môn thể thao:</div>
              <div class="info-value">${sportLabels[data.sport] || data.sport}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Địa chỉ:</div>
              <div class="info-value">${data.location}</div>
            </div>
          </div>

          ${data.description ? `
            <div class="info-section">
              <h2><span class="section-icon">📝</span> Mô tả chi tiết</h2>
              <div class="description-box">
                ${data.description.replace(/\n/g, '<br>')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>📅 Thời gian đăng ký: ${new Date().toLocaleString('vi-VN')}</p>
          <p>Vui lòng liên hệ với khách hàng trong vòng 24 giờ để xác nhận thông tin.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    // Parse dữ liệu từ request
    const formData: OwnerFormData = await request.json();

    // Validate dữ liệu cơ bản
    const requiredFields = ['name', 'email', 'phone', 'fieldName', 'location', 'sport'];
    for (const field of requiredFields) {
      if (!formData[field as keyof OwnerFormData]) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Thiếu thông tin bắt buộc: ${field}` 
          }, 
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email không hợp lệ' 
        }, 
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
      console.error('Missing environment variables for email configuration');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server configuration error. Please contact administrator.' 
        }, 
        { status: 500 }
      );
    }

    // Tạo transporter
    const transporter = createTransporter();

    // Cấu hình email
    const mailOptions = {
      from: `"Hệ thống đăng ký sân" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // Email của bạn để nhận thông báo
      subject: `🏟️ Đăng ký đối tác mới: ${formData.fieldName}`,
      html: createEmailTemplate(formData),
      // Thêm email text version để tăng deliverability
      text: `
        ĐĂNG KÝ ĐỐI TÁC MỚI
        
        Thông tin chủ sân:
        - Họ tên: ${formData.name}
        - Email: ${formData.email}
        - SĐT: ${formData.phone}
        
        Thông tin sân:
        - Tên sân: ${formData.fieldName}
        - Môn thể thao: ${formData.sport}
        - Địa chỉ: ${formData.location}
        
        Mô tả: ${formData.description || 'Không có'}
        
        Thời gian: ${new Date().toLocaleString('vi-VN')}
      `,
      attachments: [
        {
          filename: 'SportHub-Logo.png',
          path: path.join(process.cwd(), 'public', 'SportHub-Logo.png'),
          cid: 'sportHubLogo' // same cid value as in the html img src
        }
      ]
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    // Trả về response thành công
    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ trong vòng 24 giờ.',
      messageId: info.messageId,
    });

  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // Return a proper JSON response even in case of unexpected errors
    let message = 'Có lỗi xảy ra khi gửi đăng ký. Vui lòng thử lại sau.';
    
    // Provide more specific error messages when possible
    if (error.code === 'EAUTH' || error.code === 'ECONNREFUSED') {
      message = 'Email service configuration error. Please contact administrator.';
    } else if (error.message) {
      message = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message 
      }, 
      { status: 500 }
    );
  }
}

// Optional: Handle GET request for testing
export async function GET() {
  return NextResponse.json({
    message: 'Owner registration API is running',
    endpoints: {
      POST: '/api/owner-register - Submit owner registration'
    }
  });
}