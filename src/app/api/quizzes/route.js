export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get("moduleId");
  const lessonCount = parseInt(searchParams.get("lessonCount"), 10);

  if (!moduleId || isNaN(lessonCount)) {
    return new Response(
      JSON.stringify({ error: "moduleId and lessonCount are required" }),
      { status: 400 }
    );
  }

  const numQuizzes = Math.max(2, Math.ceil(lessonCount / 4));
  const interval = Math.floor(lessonCount / numQuizzes);

  const quizzes = Array.from({ length: numQuizzes }, (_, i) => {
    const afterLesson = (i + 1) * interval;
    return {
      id: `quiz-${i + 1}`,
      title: `Quiz ${i + 1}`,
      afterLesson: afterLesson > lessonCount ? lessonCount : afterLesson,
      moduleId,
    };
  });

  const lastQuiz = quizzes[quizzes.length - 1];
  if (!lastQuiz || lastQuiz.afterLesson < lessonCount) {
    quizzes.push({
      id: `quiz-${quizzes.length + 1}`,
      title: "Final Quiz",
      afterLesson: lessonCount,
      moduleId,
    });
  } else {
    lastQuiz.title = "Final Quiz";
  }

  return new Response(JSON.stringify(quizzes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
