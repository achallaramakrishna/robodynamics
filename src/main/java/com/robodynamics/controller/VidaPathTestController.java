package com.robodynamics.controller;

import com.robodynamics.service.VidaPathAdaptiveService;
import com.robodynamics.vidapath.FutureCareer;
import com.robodynamics.vidapath.VidaPathAnswerSubmission;
import com.robodynamics.vidapath.VidaPathQuestionPayload;
import com.robodynamics.vidapath.VidaPathSessionState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vidapath/api")
public class VidaPathTestController {

    private final VidaPathAdaptiveService adaptiveService;

    @Autowired
    public VidaPathTestController(VidaPathAdaptiveService adaptiveService) {
        this.adaptiveService = adaptiveService;
    }

    @PostMapping("/session/start")
    public ResponseEntity<SessionStartResponse> startSession(@RequestBody StartSessionRequest request) {
        if (request.getStudentId() == null) {
            return ResponseEntity.badRequest().build();
        }
        String token = adaptiveService.startSession(request.getStudentId(), request.getGradeBand());
        List<VidaPathQuestionPayload> batch = adaptiveService.getNextBatch(token);
        VidaPathSessionState state = adaptiveService.getSessionState(token);
        return ResponseEntity.ok(new SessionStartResponse(token, batch, state));
    }

    @PostMapping("/session/{token}/answers")
    public ResponseEntity<QuestionBatchResponse> submitAnswers(
            @PathVariable String token,
            @RequestBody AnswerBatchRequest request) {
        adaptiveService.recordAnswers(token, request.getAnswers());
        List<VidaPathQuestionPayload> nextBatch = adaptiveService.getNextBatch(token);
        VidaPathSessionState state = adaptiveService.getSessionState(token);
        return ResponseEntity.ok(new QuestionBatchResponse(nextBatch, state));
    }

    @GetMapping("/session/{token}/state")
    public ResponseEntity<VidaPathSessionState> sessionState(@PathVariable String token) {
        return ResponseEntity.ok(adaptiveService.getSessionState(token));
    }

    @GetMapping("/future-careers")
    public ResponseEntity<List<FutureCareer>> futureCareers() {
        return ResponseEntity.ok(adaptiveService.listFutureCareers());
    }

    public static class StartSessionRequest {
        private Integer studentId;
        private String gradeBand;

        public Integer getStudentId() {
            return studentId;
        }

        public void setStudentId(Integer studentId) {
            this.studentId = studentId;
        }

        public String getGradeBand() {
            return gradeBand;
        }

        public void setGradeBand(String gradeBand) {
            this.gradeBand = gradeBand;
        }
    }

    public static class AnswerBatchRequest {
        private List<VidaPathAnswerSubmission> answers;

        public List<VidaPathAnswerSubmission> getAnswers() {
            return answers;
        }

        public void setAnswers(List<VidaPathAnswerSubmission> answers) {
            this.answers = answers;
        }
    }

    public record SessionStartResponse(String sessionToken,
                                       List<VidaPathQuestionPayload> questions,
                                       VidaPathSessionState state) {
    }

    public record QuestionBatchResponse(List<VidaPathQuestionPayload> questions,
                                        VidaPathSessionState state) {
    }
}
