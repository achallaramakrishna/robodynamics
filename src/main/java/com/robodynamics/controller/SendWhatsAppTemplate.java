package com.robodynamics.controller;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.json.JSONObject;
import java.util.HashMap;

public class SendWhatsAppTemplate {
    public static void main(String[] args) {
        String ACCOUNT_SID = "ACbbe8018ca570c46f2c97abb72a6b7085";
        String AUTH_TOKEN  = "6cee1a106f97b213bd4bcbe6a987c564";
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        String to = "whatsapp:++916366622728";            // <-- recipient
        String messagingServiceSid = "MGa897be7a55bec4dd13cba80e4a80e714"; // <-- real MG SID
        String contentSid = "HXa9422dde79769741d909276ca594bea6";              // <-- real HX SID

        // If your template uses {{1}}, {{2}}...
        JSONObject vars = new JSONObject(new HashMap<String, Object>() {{
            put("1", "My Super Hero Anirudh !!!");
            // put("2", "7:00 PM");
            // put("3", "14 Sep 2025");
        }});

        try {
            Message msg = Message.creator(
                    new PhoneNumber(to),
                    messagingServiceSid,
                    "" // empty body for Content API templates
            )
            .setContentSid(contentSid)
            .setContentVariables(vars.toString())
            .create();
            System.out.println("hello");
        } catch (com.twilio.exception.ApiException e) {
            System.err.println("Twilio API Error: " + e.getStatusCode() + " - " + e.getCode() + " - " + e.getMessage());
            // Common fixes: check 'to' format, MG SID, HX SID, variables, WA sender on MG
        }
    }
}
