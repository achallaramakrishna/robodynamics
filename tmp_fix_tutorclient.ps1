Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$dst = 'C:\roboworkspace\robodynamics\ai-tutor\web\app\ai-tutor\tutor\TutorClient.tsx'
$content = Get-Content $dst -Raw

function Replace-One {
  param(
    [string]$Label,
    [string]$Old,
    [string]$New
  )
  if (-not $script:content.Contains($Old)) {
    throw "Replacement target not found: $Label"
  }
  $script:content = $script:content.Replace($Old, $New)
}

$old = @"
  const activeLessonStepIndex = useMemo(() => {
    const index = lessonPath.findIndex((item) => item.exerciseGroup === activeExerciseGroup);
    return index >= 0 ? index : 0;
  }, [lessonPath, activeExerciseGroup]);
  const missionPrompt =
"@
$new = @"
  const activeLessonStepIndex = useMemo(() => {
    const index = lessonPath.findIndex((item) => item.exerciseGroup === activeExerciseGroup);
    return index >= 0 ? index : 0;
  }, [lessonPath, activeExerciseGroup]);
  const lessonGroupOrder = useMemo(() => {
    const raw = lessonPath.length ? lessonPath.map((item) => item.exerciseGroup) : [];
    const fallback = lessonExerciseFlow.map((item) => item.exerciseGroup);
    const ordered = (raw.length ? raw : fallback)
      .map((value) => String(value || '').trim())
      .filter(Boolean);
    return [...new Set(ordered)];
  }, [lessonExerciseFlow, lessonPath]);
  const missionPrompt =
"@
Replace-One 'lesson group order' $old $new

$old = @"
      const winLine = activeDuolingoStep?.instantFeedbackWin || "Great work. Moving to the next question.";
      const retryBaseLine = activeDuolingoStep?.instantFeedbackRetry || `Good attempt. ${activeTeachingStep?.checkpointPrompt || "Let us retry this with one smaller step."}`;
      const retrySupportLine = activeDuolingoStep?.reviewPrompt || activeTeachingStep?.microPractice || "";
      const retryLine = retrySupportLine ? `${retryBaseLine} ${retrySupportLine}` : retryBaseLine;
      if (data.correct) {
        setTeacherUtterance(winLine);
        if (autoTeachEnabled) {
          await speakRef.current(winLine);
          if (data.coachTip) {
            await speakRef.current(data.coachTip);
          }
          await nextQuestion();
          return;
        }
        await speakRef.current(winLine);
        if (data.coachTip) {
          await speakRef.current(data.coachTip);
        }
      } else {
        setTeacherUtterance(retryLine);
        if (autoTeachEnabled) {
          await speakRef.current(retryLine);
          if (data.coachTip) {
            await speakRef.current(data.coachTip);
          }
          clearBoard();
          setTeacherUtterance(retryLine);
          setPendingKickoffToken(`${Date.now()}_${sessionId}_${question.questionId}_retry`);
          setPendingKickoff("teach");
        } else {
          await speakRef.current(retryLine);
          if (data.coachTip) {
            await speakRef.current(data.coachTip);
          }
        }
      }
"@
$new = @"
      const winLine = activeDuolingoStep?.instantFeedbackWin || "Great work. Moving to the next question.";
      const retryBaseLine = activeDuolingoStep?.instantFeedbackRetry || `Good attempt. ${activeTeachingStep?.checkpointPrompt || "Let us retry this with one smaller step."}`;
      const retrySupportLine = activeDuolingoStep?.reviewPrompt || activeTeachingStep?.microPractice || "";
      const retryLine = retrySupportLine ? `${retryBaseLine} ${retrySupportLine}` : retryBaseLine;
      if (data.correct) {
        setTeacherUtterance(winLine);
        if (autoTeachEnabled) {
          await speakRef.current(winLine);
          if (data.coachTip) {
            await speakRef.current(data.coachTip);
          }
          await nextQuestion({ source: "correct_answer" });
          return;
        }
        await speakRef.current(winLine);
        if (data.coachTip) {
          await speakRef.current(data.coachTip);
        }
      } else {
        setTeacherUtterance(retryLine);
        setAwaitingStudentResponse(true);
        await speakRef.current(retryLine);
        if (data.coachTip) {
          await speakRef.current(data.coachTip);
        }
      }
"@
Replace-One 'answer resolution flow' $old $new

$nextQuestionPattern = '(?s)  async function nextQuestion\(\) \{\r?\n.*?\r?\n  \}\r?\n\r?\n  async function askDoubt\(\) \{'
$nextQuestionReplacement = @"
  function getNextExerciseGroup(currentGroup: string): string {
    const current = String(currentGroup || '').trim();
    if (!current || !lessonGroupOrder.length) {
      return current || selectedExerciseGroup;
    }
    const index = lessonGroupOrder.indexOf(current);
    if (index < 0 || index >= lessonGroupOrder.length - 1) {
      return current;
    }
    return lessonGroupOrder[index + 1];
  }

  function buildQuestionProbeOrder(currentGroup: string, source?: 'correct_answer' | 'skip'): string[] {
    const current = String(currentGroup || '').trim();
    const orderedGroups = lessonGroupOrder.length
      ? lessonGroupOrder.map((value) => String(value || '').trim()).filter(Boolean)
      : [current || selectedExerciseGroup].filter(Boolean);
    if (!orderedGroups.length) {
      return current ? [current] : [];
    }

    const startIndex = Math.max(orderedGroups.indexOf(current), 0);
    const rotated = [
      ...orderedGroups.slice(startIndex),
      ...orderedGroups.slice(0, startIndex),
    ].filter(Boolean);
    const nextGroup = getNextExerciseGroup(current);
    const preferred = source === 'skip'
      ? [current, ...rotated]
      : [nextGroup || current, ...rotated.filter((group) => group !== nextGroup)];

    return [...new Set(preferred.filter(Boolean))];
  }

  async function nextQuestion(options?: { directToStudent?: boolean; source?: 'correct_answer' | 'skip' }) {
    if (!sessionId) return;
    const currentExerciseGroup = activeExerciseGroup || selectedExerciseGroup;
    const previousQuestionId = question?.questionId || '';
    const previousQuestionText = question?.questionText || '';

    setAnswer('');
    setCheck(null);
    setDoubtReply('');
    setPendingKickoff('none');
    setPendingKickoffToken('');
    kickoffRunningRef.current = false;
    autoListenQuestionRef.current = '';
    stopListeningSession();
    setIsEvaluatingAnswer(false);
    setLastAnswerMode('typed');
    setAwaitingStudentResponse(false);

    const requestBody = {
      sessionId,
      courseId,
      chapterCode: selectedChapter,
      exerciseGroup: currentExerciseGroup,
    };
    const fetchNextQuestionPayload = async () => {
      const response = await fetch('/api/vedic/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data: TutorNextQuestionResponse & { error?: string } = await response.json();
      return { response, data };
    };

    const isRepeatedQuestion = (candidate: TutorNextQuestionResponse & { error?: string }, ok: boolean) =>
      ok &&
      !candidate.error &&
      !!previousQuestionId &&
      !!candidate.question &&
      (
        candidate.question.questionId === previousQuestionId ||
        (!!previousQuestionText && candidate.question.questionText === previousQuestionText)
      );

    const probeGroups = buildQuestionProbeOrder(currentExerciseGroup, options?.source);
    let response: Response | null = null;
    let data: (TutorNextQuestionResponse & { error?: string }) | null = null;
    let resolvedExerciseGroup = currentExerciseGroup;

    for (const group of probeGroups) {
      requestBody.exerciseGroup = group;
      const candidate = await fetchNextQuestionPayload();
      response = candidate.response;
      data = candidate.data;
      resolvedExerciseGroup = group;
      if (!response.ok || data.error) {
        continue;
      }
      if (!isRepeatedQuestion(data, response.ok)) {
        break;
      }
    }

    if (!response || !data) {
      setError('Unable to load next question.');
      return;
    }
    if (!response.ok || data.error) {
      const msg = data.error || 'Unable to load next question.';
      setError(msg);
      if (isExpiredSessionError(msg)) {
        await recoverExpiredSession('next_question');
      }
      return;
    }

    setQuestion(data.question);
    addConversationTurn(
      'system',
      'system',
      `Moved to next question: Exercise ${data.question?.exerciseGroup || resolvedExerciseGroup}`,
      { source: 'next_question' }
    );
    void sendOrchestratorCommand('NEXT_QUESTION', {
      questionId: data.question?.questionId || '',
      chapterCode: data.activeChapterCode || selectedChapter,
      exerciseGroup: data.activeExerciseGroup || resolvedExerciseGroup,
    });
    setQuestionShownAt(Date.now());
    if (data.courseId) setCourseId(data.courseId);
    if (data.activeChapterCode) {
      setActiveChapter(data.activeChapterCode);
      setSelectedChapter(data.activeChapterCode);
    }
    if (data.activeExerciseGroup) {
      setActiveExerciseGroup(data.activeExerciseGroup);
      setSelectedExerciseGroup(data.activeExerciseGroup);
    } else {
      setActiveExerciseGroup(resolvedExerciseGroup);
      setSelectedExerciseGroup(resolvedExerciseGroup);
    }
    if (data.sessionProgress) {
      setSessionProgress(data.sessionProgress);
    }
    if (data.lesson) {
      setLessonTitle(data.lesson.title);
      setLessonGradeBand(data.lesson.gradeBand || '');
      setLessonSource(data.lesson.source);
      setLessonEstimatedMinutes(data.lesson.estimatedMinutes || 0);
      setLessonSubtopics(data.lesson.subtopics || []);
      setLessonLearningGoals(data.lesson.learningGoals || []);
      setLessonExerciseCoverage(data.lesson.exerciseCoverage || []);
      setLessonExerciseFlow(data.lesson.exerciseFlow || []);
      setLessonTeachingScript(data.lesson.teachingScript || []);
      setLessonScreenplay(data.lesson.screenplay || []);
      setLessonDuolingoArc(data.lesson.duolingoLessonArc || null);
      setLessonAssetItems(data.lesson.assetItems || []);
      setCoreIdeas(data.lesson.coreIdeas || []);
      if (typeof data.lesson.dbCourseId === 'number' && data.lesson.dbCourseId > 0) {
        setDbCourseId(String(data.lesson.dbCourseId));
      }
    }

    clearBoard();
    if (options?.directToStudent) {
      setAwaitingStudentResponse(true);
      void sendOrchestratorCommand('STUDENT_TURN_READY', {
        questionId: data.question?.questionId || '',
        source: options.source || 'skip',
      });
      return;
    }
    if (autoTeachEnabled) {
      setPendingKickoffToken(`${Date.now()}_${sessionId}_${data.question?.questionId || 'q'}_teach`);
      setPendingKickoff('teach');
    }
  }

  async function askDoubt() {
"@
if (-not [regex]::IsMatch($content, $nextQuestionPattern)) {
  throw 'Replacement target not found: next question block'
}
$content = [regex]::Replace($content, $nextQuestionPattern, $nextQuestionReplacement)

Replace-One 'skip button primary' '                            <button className="button secondary" onClick={nextQuestion}>Skip</button>' '                            <button className="button secondary" onClick={() => { void nextQuestion({ directToStudent: true, source: "skip" }); }}>Skip</button>'
Replace-One 'skip button secondary' '                      <button className="button secondary" onClick={nextQuestion}>Skip</button>' '                      <button className="button secondary" onClick={() => { void nextQuestion({ directToStudent: true, source: "skip" }); }}>Skip</button>'

$content = [regex]::Replace($content, '<p className="tutor-qs-label">\{courseLabel\}.*?\{learnerLabel\}</p>', '<p className="tutor-qs-label">{courseLabel} | {learnerLabel}</p>')
$content = [regex]::Replace($content, 'Voice \{voiceEnabled \? "on" : "off"\}.*?\{" "\}', 'Voice {voiceEnabled ? "on" : "off"} |{" "}')
$content = [regex]::Replace($content, '\{workspaceLabel\}.*?Reach \{nextRewardXp\} XP for the next reward\.', '{workspaceLabel} | Reach {nextRewardXp} XP for the next reward.')
$content = [regex]::Replace($content, '<p className="ca-nav-label">Course .*?\{chapterList.length\} Chapters</p>', '<p className="ca-nav-label">Course | {chapterList.length} Chapters</p>')
$content = [regex]::Replace($content, '<button className="button secondary" onClick=\{nextQuestion\}>Next.*?</button>', '<button className="button secondary" onClick={nextQuestion}>Next</button>')

[System.IO.File]::WriteAllText($dst, $content, [System.Text.UTF8Encoding]::new($false))
