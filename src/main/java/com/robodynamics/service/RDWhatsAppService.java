package com.robodynamics.service;

public interface RDWhatsAppService {
	
	String sendText(String toE164WhatsApp, String body);
	
	String sendMedia(String toE164WhatsApp, String body, String mediaUrl);
	
	String sendTemplate(String toE164,
            String name);

}
