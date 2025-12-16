package com.robodynamics.controller;

import com.robodynamics.model.RDCompetitionRegistration;
import com.robodynamics.service.RDCompetitionRegistrationService;
import com.razorpay.Utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;

import org.json.JSONObject;

@Controller
@RequestMapping("/razorpay")
public class RazorpayWebhookController {

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Autowired
    private RDCompetitionRegistrationService registrationService;

    @PostMapping("/webhook")
    @ResponseBody
    public String handleWebhook(HttpServletRequest request) throws Exception {

        // 1. Read payload
        StringBuilder payload = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;

        while ((line = reader.readLine()) != null) {
            payload.append(line);
        }

        // 2. Verify signature
        String razorpaySignature =
                request.getHeader("X-Razorpay-Signature");

        boolean isValid = Utils.verifyWebhookSignature(
                payload.toString(),
                razorpaySignature,
                webhookSecret
        );

        if (!isValid) {
            return "INVALID SIGNATURE";
        }

        // 3. Parse JSON
        JSONObject webhook = new JSONObject(payload.toString());
        String event = webhook.getString("event");

        JSONObject paymentEntity =
                webhook.getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity");

        String razorpayOrderId = paymentEntity.getString("order_id");
        String razorpayPaymentId = paymentEntity.getString("id");

        // 4. Find registration using order_id
        RDCompetitionRegistration reg =
                registrationService.findByRazorpayOrderId(razorpayOrderId);

        if (reg == null) {
            return "ORDER NOT FOUND";
        }

        // 5. Idempotency check
        if ("SUCCESS".equals(reg.getPaymentStatus())) {
            return "ALREADY PROCESSED";
        }

        // 6. Update status
        if ("payment.captured".equals(event)) {

            registrationService.markPaymentSuccess(
                    reg.getRegistrationId(),
                    razorpayPaymentId,
                    razorpaySignature
            );

        } else if ("payment.failed".equals(event)) {

            registrationService.markPaymentFailed(
                    reg.getRegistrationId()
            );
        }

        return "OK";
    }
}
