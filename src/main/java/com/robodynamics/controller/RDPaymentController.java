package com.robodynamics.controller;

import com.robodynamics.dto.PaymentVerifyRequest;
import com.robodynamics.model.RDCompetitionRegistration;
import com.robodynamics.service.RDCompetitionRegistrationService;
import com.razorpay.*;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/parent/competitions/payment")
public class RDPaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private RDCompetitionRegistrationService registrationService;

    // ----------------------------------------------------
    // STEP 2.1 — Initiate Payment (Create Razorpay Order)
    // ----------------------------------------------------
    @GetMapping("/initiate")
    public String initiatePayment(@RequestParam("registrationId") int registrationId,
                                  Model model) throws Exception {

        System.out.println("=======================================");
        System.out.println("🔵 Initiate Payment called");
        System.out.println("Registration ID: " + registrationId);

        RDCompetitionRegistration reg =
                registrationService.findById(registrationId);

        if (reg == null) {
            System.out.println("❌ Invalid registration ID");
            model.addAttribute("errorMessage", "Invalid registration.");
            return "error";
        }

        System.out.println("Competition: " + reg.getCompetition().getTitle());
        System.out.println("Amount: ₹" + reg.getPaymentAmount());

        RazorpayClient client =
                new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", reg.getPaymentAmount() * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "RD_REG_" + reg.getRegistrationId());
        orderRequest.put("payment_capture", 1);

        Order order = client.orders.create(orderRequest);

        System.out.println("🧾 Razorpay Order Created");
        System.out.println("Order ID: " + order.get("id"));

        registrationService.updatePaymentOrder(
                registrationId,
                order.get("id")
        );

        System.out.println("🟢 Order ID saved in DB");
        System.out.println("=======================================");

        model.addAttribute("registration", reg);
        model.addAttribute("razorpayKey", razorpayKeyId);
        model.addAttribute("razorpayOrderId", order.get("id"));

        return "parent/competitions/payment";
    }

    // ----------------------------------------------------
    // STEP 2.2 — Verify Payment
    // ----------------------------------------------------
    @PostMapping(value = "/verify", produces = "application/json")
    @ResponseBody
    public Map<String, String> verifyPayment(
            @RequestBody PaymentVerifyRequest req) throws Exception {

        System.out.println("=======================================");
        System.out.println("🔵 /payment/verify called");

        System.out.println("Registration ID : " + req.getRegistrationId());
        System.out.println("Order ID        : " + req.getOrderId());
        System.out.println("Payment ID      : " + req.getPaymentId());
        System.out.println("Signature       : " + req.getSignature());

        String payload = req.getOrderId() + "|" + req.getPaymentId();

        System.out.println("Signature Payload: " + payload);
  //      System.out.println("Using Key ID    : " + razorpayKeyId);
  //      System.out.println("Using Secret   : " + razorpayKeySecret.substring(0, 6) + "******");

        boolean isValid = Utils.verifySignature(
                payload,
                req.getSignature(),
                razorpayKeySecret
        );

        System.out.println("Signature Valid : " + isValid);

        if (isValid) {
            System.out.println("✅ Payment verified. Updating DB...");

            registrationService.markPaymentSuccess(
                    req.getRegistrationId(),
                    req.getPaymentId(),
                    req.getSignature()
            );

            System.out.println("🟢 Payment marked SUCCESS in DB");
            System.out.println("=======================================");
            return Map.of("status", "SUCCESS");
        } else {
            System.out.println("❌ Signature verification FAILED");

            registrationService.markPaymentFailed(req.getRegistrationId());

            System.out.println("🔴 Payment marked FAILED in DB");
            System.out.println("=======================================");
            return Map.of("status", "FAILED");
        }
    }

    // ----------------------------------------------------
    // STEP 2.3 — Result Pages
    // ----------------------------------------------------
    @GetMapping("/success")
    public String paymentSuccess(@RequestParam int registrationId, Model model) {

        System.out.println("🟢 Payment SUCCESS page loaded");
        System.out.println("Registration ID: " + registrationId);

        model.addAttribute("registration",
                registrationService.findById(registrationId));

        return "parent/competitions/payment_success";
    }

    @GetMapping("/failure")
    public String paymentFailure(@RequestParam int registrationId, Model model) {

        System.out.println("🔴 Payment FAILURE page loaded");
        System.out.println("Registration ID: " + registrationId);

        model.addAttribute("registration",
                registrationService.findById(registrationId));

        return "parent/competitions/payment_failure";
    }
}
