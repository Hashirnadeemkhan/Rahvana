import { NextResponse, NextRequest } from "next/server";
import { 
  getInterviewSession, 
  updateInterviewSessionAnswers, 
  generateInterviewPrepOutput,
  completeInterviewSession
} from "@/lib/interview-prep/service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await getInterviewSession(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      session 
    });
  } catch (error) {
    console.error("Error fetching interview session:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview session" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { action } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case 'update-answers':
        // Update answers for the session
        const { answers } = body;
        const updatedSession = await updateInterviewSessionAnswers(sessionId, answers);
        
        return NextResponse.json({ 
          success: true, 
          session: updatedSession 
        });

      case 'generate':
        // Generate interview prep output
        const generatedOutput = await generateInterviewPrepOutput(sessionId);
        
        return NextResponse.json({ 
          success: true, 
          output: generatedOutput 
        });

      case 'complete':
        // Mark session as completed
        const completedSession = await completeInterviewSession(sessionId);
        
        return NextResponse.json({ 
          success: true, 
          session: completedSession 
        });

      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing interview session:", error);
    return NextResponse.json(
      { error: "Failed to process interview session" },
      { status: 500 }
    );
  }
}