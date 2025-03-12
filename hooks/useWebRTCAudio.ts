"use client";

import { useState, useEffect, useRef } from 'react';

// Custom hook for managing WebRTC audio streaming
export function useWebRTCAudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  
  // Initialize WebRTC and WebSocket connections
  useEffect(() => {
    const setupWebRTC = async () => {
      try {
        // Initialize WebSocket connection to your backend
        const ws = new WebSocket('wss://your-api-endpoint/interview-audio');
        websocketRef.current = ws;
        
        ws.onopen = () => {
          console.log('WebSocket connection established');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'transcription') {
            setTranscription(data.text);
          } else if (data.type === 'signal') {
            // Handle WebRTC signaling
            handleSignaling(data.signal);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error. Please try again.');
        };
        
        ws.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
        };
        
        // Initialize RTCPeerConnection
        const config = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        };
        
        const peerConnection = new RTCPeerConnection(config);
        peerConnectionRef.current = peerConnection;
        
        // Set up ICE candidate handling
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && websocketRef.current?.readyState === WebSocket.OPEN) {
            websocketRef.current.send(
              JSON.stringify({
                type: 'ice-candidate',
                candidate: event.candidate
              })
            );
          }
        };
        
        // Connection state change
        peerConnection.onconnectionstatechange = () => {
          if (peerConnection.connectionState === 'connected') {
            setIsConnected(true);
          } else if (
            peerConnection.connectionState === 'disconnected' ||
            peerConnection.connectionState === 'failed'
          ) {
            setIsConnected(false);
          }
        };
        
        // Request access to user's microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Add audio tracks to the peer connection
        stream.getAudioTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
        
        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          websocketRef.current.send(
            JSON.stringify({
              type: 'offer',
              offer: peerConnection.localDescription
            })
          );
        }
      } catch (err) {
        console.error('Error setting up WebRTC:', err);
        setError('Could not access microphone. Please check permissions.');
      }
    };
    
    setupWebRTC();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);
  
  // Handle WebRTC signaling
  const handleSignaling = async (signal: any) => {
    try {
      if (!peerConnectionRef.current) return;
      
      if (signal.type === 'answer') {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.type === 'ice-candidate') {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    } catch (err) {
      console.error('Error handling signaling:', err);
    }
  };
  
  // Start recording and streaming audio
  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        // Request microphone access if not already granted
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Add tracks to peer connection if needed
        if (peerConnectionRef.current) {
          stream.getAudioTracks().forEach(track => {
            if (peerConnectionRef.current) {
              peerConnectionRef.current.addTrack(track, stream);
            }
          });
        }
      }
      
      // Create MediaRecorder to capture audio data
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      // Send audio data in chunks via WebSocket
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && websocketRef.current?.readyState === WebSocket.OPEN) {
          websocketRef.current.send(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect data in 100ms chunks
      setIsRecording(true);
      
      // Notify server that recording has started
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(
          JSON.stringify({
            type: 'recording-started'
          })
        );
      }
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Notify server that recording has stopped
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(
          JSON.stringify({
            type: 'recording-stopped'
          })
        );
      }
    }
    
    setIsRecording(false);
  };
  
  // Close all connections
  const disconnect = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    
    setIsConnected(false);
    setIsRecording(false);
  };
  
  return {
    isRecording,
    isConnected,
    transcription,
    error,
    startRecording,
    stopRecording,
    disconnect
  };
}

// Mock version of the hook for development without actual WebRTC
export function useMockWebRTCAudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [transcription, setTranscription] = useState('');
  const [error] = useState<string | null>(null);
  
  // Simulate connection delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock recording with simulated transcription
  const startRecording = () => {
    setIsRecording(true);
    
    // Clear any previous transcription
    setTranscription('');
    
    // Simulate transcription being generated in real-time
    const mockResponses = [
      "Based on my experience",
      "Based on my experience at my previous company,",
      "Based on my experience at my previous company, I implemented a new",
      "Based on my experience at my previous company, I implemented a new CI/CD pipeline that reduced",
      "Based on my experience at my previous company, I implemented a new CI/CD pipeline that reduced deployment times by 70%.",
      "Based on my experience at my previous company, I implemented a new CI/CD pipeline that reduced deployment times by 70%. This involved setting up",
      "Based on my experience at my previous company, I implemented a new CI/CD pipeline that reduced deployment times by 70%. This involved setting up automated testing and containerizing our applications."
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setTranscription(mockResponses[index]);
      index++;
      
      if (index >= mockResponses.length) {
        clearInterval(interval);
      }
    }, 700);
    
    // Store interval ID for cleanup
    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
    }, mockResponses.length * 700 + 1000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  };
  
  const stopRecording = () => {
    setIsRecording(false);
  };
  
  const disconnect = () => {
    setIsConnected(false);
    setIsRecording(false);
    setTranscription('');
  };
  
  return {
    isRecording,
    isConnected,
    transcription,
    error,
    startRecording,
    stopRecording,
    disconnect
  };
}