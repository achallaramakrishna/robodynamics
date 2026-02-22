# AptiPath Onboarding Video Prompts (Student + Parent)

Use this to generate polished AI videos, then paste final URLs into:
- `aptipath.onboarding.studentVideoUrl`
- `aptipath.onboarding.parentVideoUrl`

Current starter clips are already live as local animated files.

## 1) Student onboarding video

### Objective
Explain the AptiPath journey in a way that keeps Grade 8-12 students engaged in the first 30 seconds.

### Duration
- 35 to 45 seconds

### Visual direction
- Modern, clean, international edu-tech style
- Teal + navy palette to match AptiPath theme
- Dynamic but not noisy
- Mobile-first readability
- Show progress checkpoints (7 sprints)

### AI video prompt (master)
Create a 40-second animated onboarding video for an Indian EdTech platform called AptiPath 360. Audience is students from Grade 8 to Grade 12. Style: premium international product, clean UI motion graphics, soft gradients, modern typography, teal and navy color system, high clarity text overlays. Tone: motivating, calm, confident. Show a structured journey with 7 sections: Core Aptitude, Applied Challenge, Interest and Work Preference, Values and Motivation, Learning Behavior, AI Readiness, Career Reality Check. Include subtle achievement cues and progress indicators. End with a strong call to action: "Start your AptiPath journey now." Avoid cartoonish visuals. Keep transitions smooth and cinematic.

### Voiceover script (Indian English)
Hi, welcome to AptiPath 360.  
This is your career intelligence journey, not just another quiz.  
You will move through seven focused sections to understand how you think, learn, and grow.  
The test adapts to your responses and builds a personalized recommendation for your future pathways.  
Answer honestly, stay focused, and complete one section at a time.  
At the end, you will get your strength map, career-fit signals, and a practical 90-day action plan.  
Let us begin.

### On-screen text sequence
1. "AptiPath 360 Student Journey"
2. "7 Sprints. 1 Clear Roadmap."
3. "Adaptive Questions | Real Signals | Personalized Guidance"
4. "Strengths + Career Fit + 90-Day Plan"
5. "Start Your Journey"

## 2) Parent onboarding video

### Objective
Reduce anxiety and explain exactly how parent inputs affect outcomes.

### Duration
- 45 to 55 seconds

### Visual direction
- Trust-first, premium counseling tone
- Clean data cards and process map animation
- Avoid fear messaging
- Show parent + student + mentor loop

### AI video prompt (master)
Create a 50-second animated onboarding video for parents using AptiPath 360, an Indian career guidance platform for school students. Style: premium, trustworthy, state-of-the-art product communication. Visual language: elegant motion graphics, process map cards, dashboard-style indicators, teal and deep navy theme. Explain the flow: Parent Intake -> Student Adaptive Assessment -> Recommendation Snapshot -> 90-day Action Plan -> Mentor Checkpoints. Tone should reduce anxiety and build confidence. Include text overlays about clarity, realistic pathway planning, and actionable guidance. End with CTA: "Complete Parent Intake to unlock better recommendations."

### Voiceover script (Indian English)
Welcome to AptiPath 360 Parent Workspace.  
Your inputs are very important for accurate guidance.  
First, you share your goals, support realities, and constraints through the parent intake.  
Then your child completes an adaptive assessment across key readiness dimensions.  
AptiPath combines both perspectives to generate practical recommendations, not generic advice.  
You receive career-fit signals, risk flags, and a structured 90-day action plan.  
Mentor checkpoints can then keep execution on track.  
Please complete intake carefully to unlock better outcomes.

### On-screen text sequence
1. "AptiPath 360 for Parents"
2. "Parent Intake + Student Signals = Better Guidance"
3. "Clarity | Feasibility | Action Plan"
4. "Mentor Checkpoints for Execution"
5. "Complete Intake to Begin"

## 3) Audio options

- Default voice: Indian English female, neutral accent, calm pace (~145 words/min)
- Backup voice: Indian English male, clear and instructional
- Optional language variants: Hindi, Telugu, Kannada

## 4) Encoding specs for final files

- Format: MP4 (H.264)
- Resolution: 1920x1080 (plus 1080x1920 vertical variant later)
- Frame rate: 30 fps
- Bitrate target: 5-8 Mbps
- Max file size target: below 25 MB each

## 5) Integration in app

After video generation:
1. Upload mp4 files to `src/main/webapp/resources/assets/videos/`.
2. Set:
   - `aptipath.onboarding.studentVideoUrl=/assets/videos/aptipath-student-onboarding.mp4`
   - `aptipath.onboarding.parentVideoUrl=/assets/videos/aptipath-parent-onboarding.mp4`
3. Rebuild and restart Tomcat.

No code change is needed after this.

