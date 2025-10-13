package com.robodynamics.controller;


import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class TestAdminWhatsApp {

    // === Replace with your real values ===
    public static final String ACCOUNT_SID = "ACbbe8018ca570c46f2c97abb72a6b7085";
    public static final String AUTH_TOKEN = "6cee1a106f97b213bd4bcbe6a987c564";
    public static final String MESSAGING_SERVICE_SID = "MGa897be7a55bec4dd13cba80e4a80e714";
    public static final String ADMIN_TEMPLATE_SID = "HXc54ecae3440adb3a52bd327c8cc41047";

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        // Admin phone (to receive message)
        String adminNumber = "whatsapp:+918374377311";  

        // === Build variables exactly as template expects ===
        Map<String, String> vars = new HashMap<>();
        vars.put("1", "Admin");
        vars.put("2", "5");         // grade
        vars.put("3", "ICSE");      // board
        vars.put("4", "Ashok");     // parent name
        vars.put("5", "8374377311");// parent phone (no +91)
        vars.put("6", "325");       // leadId

        JSONObject jsonVars = new JSONObject(vars);
        System.out.println("ContentVariables JSON -> " + jsonVars.toString());

        try {
        	 Message msg = Message.creator(new PhoneNumber(adminNumber), MESSAGING_SERVICE_SID, "")
                     .setContentSid(ADMIN_TEMPLATE_SID)
                     .setContentVariables(jsonVars.toString())
                     .create();
				/*
				 * Message msg = Message.creator(new PhoneNumber(adminNumber))
				 * .setMessagingServiceSid(MESSAGING_SERVICE_SID)
				 * .setContentSid(ADMIN_TEMPLATE_SID) .setContentVariables(jsonVars.toString())
				 * .create();
				 */
            System.out.println("✅ Sent successfully. SID: " + msg.getSid());
        } catch (ApiException ex) {
            System.err.println("❌ API Error: " + ex.getStatusCode() + " " + ex.getCode() + " " + ex.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
