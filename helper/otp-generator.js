import Otp from '../models/otp.model.js'; // Model OTP
import { sendOtpEmail } from '../utils/email.js'; // Hàm gửi OTP qua email

// Helper để lưu OTP vào database
export async function storeOtp(email, otp) {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Hết hạn sau 5 phút
    await Otp.create({ email, otp, expiresAt });
}

// Helper gửi OTP qua email
export async function sendOtp(email) {
    // Tạo OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào database
    await storeOtp(email, otp);

    // Gửi OTP qua email
    await sendOtpEmail(email, otp);

    return otp;
}

// Helper kiểm tra OTP
export async function verifyOtp(email, otp) {
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 }); // Lấy OTP mới nhất
    if (!otpRecord || otpRecord.expiresAt < Date.now() || otpRecord.otp !== otp) {
        return false; // OTP không chính xác hoặc đã hết hạn
    }

    return true; // OTP hợp lệ
}

