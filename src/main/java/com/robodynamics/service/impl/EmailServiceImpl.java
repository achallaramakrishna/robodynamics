package com.robodynamics.service.impl;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.stereotype.Service;

import com.robodynamics.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	public void sendEmail(String to, String subject, String body) {

		Properties properties = new Properties();
		properties.put("mail.transport.protocol", "smtp");
		properties.put("mail.smtp.starttls.enable", "true");
		properties.put("mail.smtp.host", "smtp.gmail.com"); // Gmail's SMTP server
		properties.put("mail.smtp.port", "587"); // TLS port
		properties.put("mail.smtp.auth", "true");
		properties.put("mail.smtp.ssl.trust", "smtp.gmail.com"); // Trust Gmail's SSL certificate
		
		
		properties.put("mail.smtp.user", "ramakrishna@robodynamics.in");
		properties.put("mail.smtp.password", "Sashank01%");
		Session sendSession = Session.getInstance(properties);

		MimeMessage message = new MimeMessage(sendSession);
		try {
			message.setFrom(new InternetAddress("ramakrishna@robodynamics.in"));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			message.setSubject(subject);
			message.setText(body);

			Transport transport = sendSession.getTransport("smtps");
			transport.connect("smtp.hostinger.com", 465, "ramakrishna@robodynamics.in", "Sashank01%");
			transport.sendMessage(message, message.getAllRecipients());
			transport.close();

			System.out.println("hello email sent");

		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
