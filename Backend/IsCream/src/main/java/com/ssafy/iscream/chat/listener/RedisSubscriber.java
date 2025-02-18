package com.ssafy.iscream.chat.listener;



import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.iscream.chat.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;


    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String rawMessage = new String(message.getBody());
            log.info("📥 Redis에서 메시지 수신 (RAW): {}", rawMessage);

            ChatMessageDto chatMessageDto = objectMapper.readValue(rawMessage, ChatMessageDto.class);
            log.info("📩 메시지 파싱 완료: {}", chatMessageDto);

            String destination = "/sub/chat/room/" + chatMessageDto.getRoomId();
            log.info("📢 메시지 전송 대상: {}", destination);

            messagingTemplate.convertAndSend(destination, chatMessageDto);
        } catch (Exception e) {
            log.error("❌ Redis 메시지 처리 중 오류 발생: ", e);
        }
    }
}
