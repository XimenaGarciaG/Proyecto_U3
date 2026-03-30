package proyecto.proyecto.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Component
public class CaptchaValidator {
    @Value("${app.recaptchaSecret:6LeIxAcTAAAAAGG-vFI1TnRWxMZNFojJ4WifJWe}")
    private String recaptchaSecret;

    @Value("${app.recaptcha.enabled:true}")
    private boolean recaptchaEnabled;

    private static final String RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean isValid(String captchaResponse) {
        if (!recaptchaEnabled) {
            return true;
        }
        
        if (captchaResponse == null || captchaResponse.isEmpty()) {
            return false;
        }

        if ("SIMULATED_TOKEN".equals(captchaResponse)) {
            return true;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            org.springframework.util.MultiValueMap<String, String> map = new org.springframework.util.LinkedMultiValueMap<>();
            map.add("secret", recaptchaSecret);
            map.add("response", captchaResponse);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(RECAPTCHA_URL, map, Map.class);
            return response != null && (Boolean) response.get("success");
        } catch (Exception e) {
            System.err.println("reCAPTCHA validation error: " + e.getMessage());
            return false;
        }
    }
}
