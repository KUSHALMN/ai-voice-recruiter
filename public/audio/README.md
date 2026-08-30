# Pre-recorded Audio Files

This folder contains pre-generated audio files for the AI Voice Recruiter Assistant.

## Files

### greeting.mp3
Welcome message played at the start of each interview.

**Content**: "Hello! Welcome to your AI-powered interview. Please make yourself comfortable, and let's begin."

**Usage**: Reduces API calls and provides instant audio playback at interview start.

### completion.mp3
Thank you message played at the end of each interview.

**Content**: "Thank you for completing the interview. Your responses have been recorded and will be evaluated shortly. We appreciate your time and effort."

**Usage**: Provides consistent closing experience without API dependency.

## Generation

To generate or regenerate these files:

```bash
npm run generate-audio
```

This script uses the ElevenLabs API with the following configuration:
- Voice: Rachel (EXAVITQu4vr4xnSDxMaL)
- Model: eleven_multilingual_v2
- Stability: 0.65
- Similarity Boost: 0.80
- Style: 0.05

## Benefits

1. **Performance**: No network latency for static messages
2. **Reliability**: Works even if ElevenLabs API is temporarily unavailable
3. **Cost**: Reduces API character usage by ~200 chars per interview
4. **Consistency**: Same audio quality every time

## Fallback

If these files are missing or fail to load, the system automatically falls back to real-time TTS generation using the `playVoice()` function.

## File Size

- greeting.mp3: ~40-50 KB
- completion.mp3: ~60-70 KB

Total: ~100-120 KB (minimal storage impact)
