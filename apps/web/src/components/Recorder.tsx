'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Send, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface RecorderProps {
  sentenceId: string;
  onRecordingComplete: () => void;
}

export default function Recorder({ sentenceId, onRecordingComplete }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      cancelAnimationFrame(requestRef.current!);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Audio Context for Visualization
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      visualize();

      // MediaRecorder for capturing audio
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        durationRef.current = Date.now() - startTimeRef.current;
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        cancelAnimationFrame(requestRef.current!);
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please ensure permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (!canvasCtx) return;

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(249, 250, 251)'; // bg-gray-50
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // Gradient or simple color based on volume
        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const submitRecording = async () => {
    if (!audioBlob) return;
    setUploading(true);
    setError(null);

    try {
        // 1. Get Presigned URL
        const presignRes = await api.post('/recordings/presign', { sentenceId });
        console.log('Presign Response:', presignRes.data);
        const { url, recordingId, s3Url } = presignRes.data;

        // 2. Upload to S3
        console.log(`Uploading to S3 (URL: ${url})...`);
        const uploadRes = await fetch(url, {
            method: 'PUT',
            body: audioBlob,
            headers: {
                'Content-Type': 'audio/wav',
            },
        });
        
        if (!uploadRes.ok) {
            console.error('S3 Upload Failed:', uploadRes.status, uploadRes.statusText);
            throw new Error(`S3 Upload failed with status: ${uploadRes.status}`);
        }
        console.log('S3 Upload Success:', uploadRes.status);

        // 3. Commit to Database
        // For sampleRate, we can get it from audioContext, but minimal is fine if estimated
        const sampleRate = audioContextRef.current?.sampleRate || 44100;
        
        await api.post('/recordings/commit', {
            sentenceId,
            recordingId,
            s3Url: presignRes.data.key, // Use the key returned by presign, likely what backend expects
            style: 'NEUTRAL', // This should match what was requested/displayed
            durationMs: durationRef.current,
            sampleRate,
        });

        onRecordingComplete();
        setAudioBlob(null);
        setAudioUrl(null);
    } catch (err) {
        console.error('Upload failed:', err);
        setError('Failed to upload recording. Please try again.');
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="relative w-full h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <canvas ref={canvasRef} width={400} height={128} className="w-full h-full" />
        {isRecording && (
            <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                Recording
            </div>
        )}
      </div>

      {error && (
        <div className="w-full p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        {!isRecording && !audioBlob && (
            <button
                onClick={startRecording}
                className="flex flex-col items-center gap-2 p-4 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
                <div className="p-3 bg-red-600 text-white rounded-full">
                    <Mic size={24} />
                </div>
                <span className="text-sm font-medium">Record</span>
            </button>
        )}

        {isRecording && (
            <button
                onClick={stopRecording}
                className="flex flex-col items-center gap-2 p-4 rounded-full bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors"
            >
                <div className="p-3 bg-gray-800 text-white rounded-full">
                    <Square size={24} />
                </div>
                <span className="text-sm font-medium">Stop</span>
            </button>
        )}

        {!isRecording && audioBlob && (
            <>
                <button
                    onClick={startRecording} // Re-record
                    className="flex flex-col items-center gap-2 p-2 text-gray-500 hover:text-gray-700"
                >
                    <div className="p-3 bg-gray-200 rounded-full">
                        <Mic size={20} />
                    </div>
                    <span className="text-xs">Retry</span>
                </button>

                <button
                    onClick={playRecording}
                    className="flex flex-col items-center gap-2 p-2 text-blue-600 hover:text-blue-800"
                >
                    <div className="p-4 bg-blue-100 rounded-full">
                        <Play size={28} className="ml-1" />
                    </div>
                    <span className="text-sm font-medium">Play</span>
                </button>

                <button
                    onClick={submitRecording}
                    disabled={uploading}
                    className="flex flex-col items-center gap-2 p-2 text-green-600 hover:text-green-800 disabled:opacity-50"
                >
                    <div className="p-4 bg-green-100 rounded-full">
                        {uploading ? <Loader2 size={28} className="animate-spin" /> : <Send size={28} />}
                    </div>
                    <span className="text-sm font-medium">{uploading ? 'Sending...' : 'Submit'}</span>
                </button>
            </>
        )}
      </div>
    </div>
  );
}
