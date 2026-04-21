import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId");
  const topic = request.nextUrl.searchParams.get("topic");

  if (!studentId) {
    return NextResponse.json({ error: "Student ID required" }, { status: 400 });
  }

  try {
    // Get chapter metadata
    const chapters = {
      intro: {
        id: "intro",
        title: "What is Photosynthesis?",
        duration: 8,
        difficulty: "easy",
        practiceQuestions: 3,
        description:
          "Introduction to photosynthesis: inputs, outputs, and the fundamental equation",
      },
      light_reactions: {
        id: "light_reactions",
        title: "Light Reactions (How Plants Capture Energy)",
        duration: 15,
        difficulty: "medium",
        practiceQuestions: 4,
        description:
          "Deep dive into light reactions: photons, electron excitation, ATP and NADPH synthesis",
      },
      dark_reactions: {
        id: "dark_reactions",
        title: "Dark Reactions (Calvin Cycle - Building Glucose)",
        duration: 12,
        difficulty: "medium",
        practiceQuestions: 4,
        description:
          "Understanding the Calvin Cycle: carbon fixation, reduction, and regeneration",
      },
      limiting_factors: {
        id: "limiting_factors",
        title: "Factors Affecting Photosynthesis",
        duration: 8,
        difficulty: "easy",
        practiceQuestions: 3,
        description: "Light, temperature, and CO₂ effects on photosynthesis rate",
      },
      real_world: {
        id: "real_world",
        title: "Real-World Evidence & Applications",
        duration: 6,
        difficulty: "easy",
        practiceQuestions: 3,
        description:
          "Experiments proving photosynthesis and its real-world impact",
      },
    };

    if (topic && chapters[topic as keyof typeof chapters]) {
      return NextResponse.json({
        chapter: chapters[topic as keyof typeof chapters],
        studentId,
      });
    }

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Lesson API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, topicId, accuracy, timeSpent } = body;

    if (!studentId || !topicId || accuracy === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database via Prisma
    const prisma = new PrismaClient();
    const progress = await prisma.studentLessonProgress.create({
      data: {
        studentId,
        lessonId: "photosynthesis",
        topicId,
        accuracy,
        timeSpent: timeSpent || 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Progress saved successfully",
        data: progress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lesson progress save error:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
