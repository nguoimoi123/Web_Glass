import dotenv from "dotenv";
import path from "path";
import { Request, Response } from "express";
import OpenAI from "openai";

// ✅ Nạp file .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Mô tả vai trò của chatbot
const SYSTEM_PROMPT = `Bạn là một trợ lý AI thân thiện và hiểu biết cho VisionLuxe — cửa hàng mắt kính cao cấp. 

Về VisionLuxe:
- Bán các loại mắt kính thời trang, kính mát, kính cận, và phụ kiện
- Sản phẩm kết hợp giữa phong cách và tính năng
- Miễn phí vận chuyển cho đơn hàng trên 100$
- Chính sách đổi trả trong vòng 30 ngày
- Có tính năng thử kính ảo (virtual try-on)

Vai trò của bạn:
- Giúp khách hàng chọn loại kính phù hợp nhất
- Giải đáp thắc mắc về sản phẩm, kích thước, chất liệu, và cách bảo quản
- Đưa ra gợi ý phong cách dựa trên hình dạng khuôn mặt và sở thích
- Hỗ trợ tra cứu đơn hàng, đổi trả, vận chuyển
- Luôn thân thiện, chuyên nghiệp, và am hiểu
- Nếu bị hỏi về sản phẩm không có trong ngữ cảnh, hãy khuyên khách truy cập trang Shop

Giữ câu trả lời ngắn gọn (2–3 câu), trừ khi người dùng yêu cầu chi tiết hơn.`;

// ✅ Hàm chính xử lý hội thoại
export const chatWithBot = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    // Kiểm tra hợp lệ
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Cần có trường 'message' kiểu chuỗi (string)." });
    }

    // ✅ Tạo danh sách tin nhắn gửi lên API
    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

    // ✅ Thêm lịch sử hội thoại gần nhất (tối đa 10 tin)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory
        .slice(-10)
        .filter((m) => m.role && m.content);
      messages.push(...recentHistory);
    }

    // ✅ Thêm tin nhắn hiện tại của người dùng
    messages.push({ role: "user", content: message });

    console.log("🗨️ Gửi yêu cầu tới OpenAI với", messages.length, "tin nhắn...");

    // ✅ Gọi OpenAI API (model hiện tại không hỗ trợ temperature tùy chỉnh)
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Hoặc "gpt-4o-mini" để tiết kiệm chi phí
      messages,
      max_completion_tokens: 800,
    });

    const botMessage =
      response.choices?.[0]?.message?.content?.trim() || "(Không có phản hồi)";


    // ✅ Gửi phản hồi về frontend
    res.json({
      message: botMessage,
      conversationId: Date.now().toString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Không thể lấy phản hồi từ chatbot",
      details: error.response?.data || error.message,
    });
  }
};
