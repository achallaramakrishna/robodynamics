package com.robodynamics.service.impl;

import com.robodynamics.service.RDWhatsAppService;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;

import org.json.JSONObject;

@Service
public class RDWhatsAppServiceImpl implements RDWhatsAppService {

	@Value("${twilio.accountSid}")
	private String accountSid;

	@Value("${twilio.authToken}")
	private String authToken;

	@Value("${twilio.messagingServiceSid}")
	private String messagingServiceSid;

	@Value("${twilio.templateSid}")
	private String templateSid;

	@Value("${twilio.whatsappFrom}")
	private String from;

	public RDWhatsAppServiceImpl(@Value("${twilio.accountSid}") String sid,
			@Value("${twilio.authToken}") String token) {
		Twilio.init(sid, token);
	}

	public String sendTemplate(String toE164, String name) {
		
		
	    System.out.println("sendTemplate start...");
	    String to = toE164.startsWith("whatsapp:") ? toE164 : "whatsapp:" + toE164;

	    System.out.println("To - " + to);
	    
	    org.json.JSONObject vars = new org.json.JSONObject();
	    vars.put("1", name); // must match your template's {{1}}

	    try {
	    // ////   com.twilio.rest.api.v2010.account.Message msg =
	     //       com.twilio.rest.api.v2010.account.Message
	     //           .creator(new com.twilio.type.PhoneNumber(to), new com.twilio.type.PhoneNumber(messagingServiceSid),templateSid) // <-- no body overload
	   //             .setContentVariables(vars.toString())
	   //             .create();

	        		
	    	Message message = Message.creator(
	    	        new PhoneNumber(to),  // To
	    	        "messagingServiceSid",   // From (Twilio WA number)
	    	        ""      // Body (required here)
	    	).setContentSid(templateSid)
	    	.setContentVariables(new JSONObject(new HashMap<String, Object>() { {
				  put("1", "Name"); } }).toString())
	    	.create();
	    	System.out.println("Msg sid - " + messagingServiceSid);
	    	System.out.println("template sid - " + templateSid);
			/*
			 * Message message = Message .creator(new com.twilio.type.PhoneNumber(to),
			 * "MGa897be7a55bec4dd13cba80e4a80e714")
			 * .setContentSid("HXa9422dde79769741d909276ca594x`bea6")
			 * .setContentVariables(new JSONObject(new HashMap<String, Object>() { {
			 * put("1", "Name"); } }).toString()) .create();
			 */ ////       System.out.println("Queued OK. SID=" + message.getSid() + " status=" + message.getStatus());

	        System.out.println(message.getBody());

	        
	        return message.getSid();

	    } catch (com.twilio.exception.ApiException e) {
	        System.err.println("Twilio ApiException code=" + e.getCode() + " msg=" + e.getMessage());
	        throw e;
	    }
	}


	
	public String sendText(String toE164WhatsApp, String body) {
		Message msg = Message.creator(new PhoneNumber("whatsapp:" + toE164WhatsApp.replace("whatsapp:", "")),
				new PhoneNumber(from), body).create();
		return msg.getSid();
	}

	public String sendMedia(String toE164WhatsApp, String body, String mediaUrl) {
		Message msg = Message.creator(new PhoneNumber("whatsapp:" + toE164WhatsApp.replace("whatsapp:", "")),
				new PhoneNumber(from), body).setMediaUrl(java.util.List.of(java.net.URI.create(mediaUrl))).create();
		return msg.getSid();
	}

	
}
