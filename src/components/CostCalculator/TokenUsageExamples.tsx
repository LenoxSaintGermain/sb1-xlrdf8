import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Video, MessageSquare, FileVolume } from 'lucide-react';

interface TokenUsageExamplesProps {
  monthlyTokens: number;
  monthlyCharacters: number;
}

export function TokenUsageExamples({ monthlyTokens, monthlyCharacters }: TokenUsageExamplesProps) {
  // Approximate token to word ratio is 4:3 (4 tokens ≈ 3 words)
  const approximateWords = Math.round((monthlyTokens * 0.75));
  
  // Average words per page (based on standard documentation format)
  const wordsPerPage = 250;
  const approximatePages = Math.round(approximateWords / wordsPerPage);
  
  // Average words per minute in training videos
  const wordsPerMinute = 150;
  const approximateMinutes = Math.round(approximateWords / wordsPerMinute);
  
  // Characters to words for voice (average word length of 5 characters)
  const voiceWords = Math.round(monthlyCharacters / 5);
  const voiceMinutes = Math.round(voiceWords / wordsPerMinute);

  return (
    <Card>
      <CardHeader>
        <CardTitle>What This Usage Means</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Your selected monthly usage of {monthlyTokens.toLocaleString()} tokens and {monthlyCharacters.toLocaleString()} characters is approximately equivalent to:
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
            <FileText className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h4 className="font-medium">Documentation Generation</h4>
              <p className="text-sm text-muted-foreground">
                ≈ {approximatePages.toLocaleString()} pages of pharmaceutical documentation
                ({approximateWords.toLocaleString()} words)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
            <BookOpen className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h4 className="font-medium">Training Materials</h4>
              <p className="text-sm text-muted-foreground">
                Enough for {Math.round(approximatePages / 25)} complete training modules
                (assuming 25 pages per module)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
            <Video className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h4 className="font-medium">Video Script Generation</h4>
              <p className="text-sm text-muted-foreground">
                ≈ {approximateMinutes} minutes of video script content
                ({Math.round(approximateMinutes / 15)} typical training videos)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
            <MessageSquare className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h4 className="font-medium">Q&A Interactions</h4>
              <p className="text-sm text-muted-foreground">
                Support for approximately {Math.round(monthlyTokens / 1000)} detailed Q&A exchanges
                (based on average interaction length)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
            <FileVolume className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h4 className="font-medium">Voice Generation</h4>
              <p className="text-sm text-muted-foreground">
                ≈ {voiceMinutes} minutes of narration
                ({Math.round(voiceMinutes / 5)} training segments)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 text-sm">
          <p className="font-medium">💡 Pro Tips:</p>
          <ul className="list-disc ml-4 mt-2 space-y-1 text-muted-foreground">
            <li>For documentation, consider batch processing to reduce costs</li>
            <li>Use GPT-3.5 for initial drafts, GPT-4 for final review</li>
            <li>Combine voice generation plans for longer training modules</li>
            <li>Pre-process and chunk content to optimize token usage</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}