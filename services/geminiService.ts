import { GoogleGenAI, Type } from "@google/genai";
import { Room, Booking } from '../types';

const getAiClient = () => {
  // const apiKey = process.env.API_KEY;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Sends the user query along with room and booking context to Gemini
 * to get a structured recommendation.
 */
export const getRoomRecommendation = async (
  query: string,
  rooms: Room[],
  bookings: Booking[]
): Promise<{ text: string; recommendedRoomId?: string } | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  const currentDateTime = new Date().toLocaleString('vi-VN');
  
  // Simplify data for the prompt to save tokens and reduce complexity
  const simplifiedRooms = rooms.map(r => ({
    id: r.id,
    name: r.name,
    capacity: r.capacity,
    equipment: r.equipment,
    status: r.status
  }));

  const simplifiedBookings = bookings.map(b => ({
    roomId: b.roomId,
    start: new Date(b.startTime).toLocaleString('vi-VN'),
    end: new Date(b.endTime).toLocaleString('vi-VN'),
    title: b.title
  }));

  const prompt = `
    Bạn là trợ lý ảo thông minh cho hệ thống đặt phòng họp "SmartRoom".
    Thời gian hiện tại: ${currentDateTime}.
    
    Danh sách phòng:
    ${JSON.stringify(simplifiedRooms)}
    
    Lịch đặt phòng hiện tại:
    ${JSON.stringify(simplifiedBookings)}
    
    Yêu cầu của người dùng: "${query}"
    
    Hãy phân tích yêu cầu, kiểm tra lịch trống và thiết bị phù hợp, sau đó đưa ra câu trả lời.
    Nếu tìm thấy phòng phù hợp, hãy trả về ID của phòng đó.
    Nếu không có phòng phù hợp hoặc yêu cầu không rõ ràng, hãy giải thích và hỏi thêm thông tin.
    Trả lời ngắn gọn, lịch sự, bằng tiếng Việt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: "Câu trả lời của bạn dành cho người dùng."
            },
            recommendedRoomId: {
              type: Type.STRING,
              description: "ID của phòng được gợi ý (nếu có). Để trống nếu không tìm thấy.",
              nullable: true
            }
          },
          required: ["replyText"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        text: data.replyText,
        recommendedRoomId: data.recommendedRoomId || undefined
      };
    }
    return { text: "Xin lỗi, tôi không thể xử lý yêu cầu lúc này." };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Đã xảy ra lỗi khi kết nối với trợ lý AI." };
  }
};